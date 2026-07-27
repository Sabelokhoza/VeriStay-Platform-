using AutoMapper;
using ko.core.Contracts;
using ko.core.Exceptions;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;

using Microsoft.EntityFrameworkCore;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class RentPaymentService : IRentPaymentService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IAppLogger<RentPaymentService> _logger;
        private readonly IMapper _mapper;
        private readonly IReceiptGeneratorService _receiptGenerator;

        public RentPaymentService(
            AppDbContext appDbContext,
            IAppLogger<RentPaymentService> logger,
            IMapper mapper,
            IReceiptGeneratorService receiptGenerator
             )
        {
            _appDbContext = appDbContext;
            _logger = logger;
            _mapper = mapper;
            _receiptGenerator = receiptGenerator;
        }

        // =============================================
        // Private helper — map entity to DTO
        // =============================================

        private static RentPaymentDto MapToDto(RentPayment p, Tenancy tenancy)
        {
            return new RentPaymentDto
            {
                Id = p.Id,
                TenancyId = p.TenancyId,
                StudentName = tenancy.Student?.FullName ?? string.Empty,
                StudentId = tenancy.StudentId ?? string.Empty,
                PropertyTitle = tenancy.Property?.Title ?? $"Property #{tenancy.PropertyId}",
                PropertyLocation = $"{tenancy.Property?.Address} - {tenancy.Property?.City}",
                Amount = p.Amount,
                DueDate = p.DueDate,
                PaidAt = p.PaidAt,
                Status = p.Status,
                ReceiptUrl = p.ReceiptUrl ?? string.Empty,
            };
        }

        // =============================================
        // Private helper — deduplicate then generate
        // =============================================

        private async Task EnsureMonthlyPaymentsGeneratedAsync(Tenancy tenancy)
        {
            var leaseStart = tenancy.LeaseStartDate;
            var leaseEnd = tenancy.LeaseEndDate;
            var today = DateTime.UtcNow;
            var generateUpTo = today.AddMonths(1) < leaseEnd
                ? today.AddMonths(1)
                : leaseEnd;

            // ── Step 1: remove duplicates (same tenancy + same year/month) ──

            var allPayments = await _appDbContext.RentPayments
                .Where(r => r.TenancyId == tenancy.Id)
                .OrderBy(r => r.Id)
                .ToListAsync();

            var duplicates = allPayments
                .GroupBy(p => new { p.DueDate.Year, p.DueDate.Month })
                .Where(g => g.Count() > 1)
                .SelectMany(g => g.Skip(1)) // keep lowest id, remove the rest
                .ToList();

            if (duplicates.Any())
            {
                _logger.LogInformation(
                    "Removing {0} duplicate payment(s) for tenancy {1}",
                    duplicates.Count, tenancy.Id);
                _appDbContext.RentPayments.RemoveRange(duplicates);
                await _appDbContext.SaveChangesAsync();
            }

            // ── Step 2: build expected due dates ──────────────────────────

            var expectedDueDates = new List<DateTime>();
            var current = new DateTime(
                leaseStart.Year, leaseStart.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            while (current <= generateUpTo)
            {
                expectedDueDates.Add(current);
                current = current.AddMonths(1);
            }

            if (!expectedDueDates.Any()) return;

            // ── Step 3: find which months are missing ─────────────────────

            var existingPayments = await _appDbContext.RentPayments
                .Where(r => r.TenancyId == tenancy.Id)
                .ToListAsync();

            var existingMonths = existingPayments
                .Select(p => (p.DueDate.Year, p.DueDate.Month))
                .ToHashSet();

            var missing = expectedDueDates
                .Where(d => !existingMonths.Contains((d.Year, d.Month)))
                .ToList();

            if (!missing.Any()) return;

            // ── Step 4: insert missing payments ───────────────────────────

            _logger.LogInformation(
                "Auto-generating {0} monthly payment(s) for tenancy {1}",
                missing.Count, tenancy.Id);

            foreach (var dueDate in missing)
            {
                await _appDbContext.RentPayments.AddAsync(new RentPayment
                {
                    TenancyId = tenancy.Id,
                    Amount = tenancy.MonthlyRent,
                    DueDate = dueDate,
                    Status = dueDate < today
                        ? PaymentStatus.Overdue
                        : PaymentStatus.Pending,
                    ReceiptUrl = string.Empty,
                });
            }

            await _appDbContext.SaveChangesAsync();
        }

        // =============================================
        // Private helper — mark overdue
        // =============================================

        private async Task MarkOverduePaymentsAsync(int tenancyId)
        {
            var now = DateTime.UtcNow;
            var overdue = await _appDbContext.RentPayments
                .Where(r =>
                    r.TenancyId == tenancyId &&
                    r.Status == PaymentStatus.Pending &&
                    r.DueDate < now)
                .ToListAsync();

            if (!overdue.Any()) return;

            overdue.ForEach(p => p.Status = PaymentStatus.Overdue);
            await _appDbContext.SaveChangesAsync();
        }

        // =============================================
        // Private helper — load tenancy with includes
        // =============================================

        private async Task<Tenancy> LoadTenancyAsync(int tenancyId)
        {
            var tenancy = await _appDbContext.Tenancies
                .FirstOrDefaultAsync(t => t.Id == tenancyId);

            if (tenancy == null)
                throw new NotFoundException(nameof(LoadTenancyAsync), tenancyId);

            return tenancy;
        }

        // =============================================
        // Get student payment summary
        // =============================================

        public async Task<StudentPaymentSummaryDto> GetStudentPaymentSummaryAsync(string studentId)
        {
            _logger.LogInformation("Getting payment summary for student {0}", studentId);

            var tenancy = await _appDbContext.Tenancies
                .FirstOrDefaultAsync(t =>
                    t.StudentId == studentId &&
                    t.Status == TenancyStatus.Active);

            if (tenancy == null)
                throw new NotFoundException("Active tenancy not found for student", studentId);

            // Auto-generate + deduplicate
            await EnsureMonthlyPaymentsGeneratedAsync(tenancy);

            // Auto-mark overdue
            await MarkOverduePaymentsAsync(tenancy.Id);

            // Re-fetch fresh after all operations
            var payments = await _appDbContext.RentPayments
                .Where(r => r.TenancyId == tenancy.Id)
                .OrderBy(r => r.DueDate)
                .ToListAsync();

            var paymentDtos = payments.Select(p => MapToDto(p, tenancy)).ToList();

            return new StudentPaymentSummaryDto
            {
                TenancyId = tenancy.Id,
                PropertyTitle = tenancy.Property?.Title ?? $"Property #{tenancy.PropertyId}",
                PropertyLocation = $"{tenancy.Property?.Address} - {tenancy.Property?.City}",
                MonthlyRent = tenancy.MonthlyRent,
                TotalPayments = payments.Count,
                PaidCount = payments.Count(p => p.Status == PaymentStatus.Paid),
                PendingCount = payments.Count(p => p.Status == PaymentStatus.Pending),
                OverdueCount = payments.Count(p => p.Status == PaymentStatus.Overdue),
                TotalPaid = payments
                    .Where(p => p.Status == PaymentStatus.Paid)
                    .Sum(p => p.Amount),
                TotalOwed = payments
                    .Where(p => p.Status != PaymentStatus.Paid)
                    .Sum(p => p.Amount),
                Payments = paymentDtos,
            };
        }

        // =============================================
        // Get by tenancy id
        // =============================================

        public async Task<List<RentPaymentDto>> GetByTenancyIdAsync(int tenancyId)
        {
            _logger.LogInformation("Getting payments for tenancy {0}", tenancyId);

            var tenancy = await LoadTenancyAsync(tenancyId);

            await EnsureMonthlyPaymentsGeneratedAsync(tenancy);
            await MarkOverduePaymentsAsync(tenancyId);

            var payments = await _appDbContext.RentPayments
                .Where(r => r.TenancyId == tenancyId)
                .OrderBy(r => r.DueDate)
                .ToListAsync();

            return payments.Select(p => MapToDto(p, tenancy)).ToList();
        }

        // =============================================
        // Get by id
        // =============================================

        public async Task<RentPaymentDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Getting payment with id {0}", id);

            var payment = await _appDbContext.RentPayments
                .FirstOrDefaultAsync(r => r.Id == id);

            var t = await _appDbContext.Tenancies
                .FirstOrDefaultAsync(r => r.Id == payment.TenancyId);


            if (payment == null)
                throw new NotFoundException(nameof(GetByIdAsync), id);

            return MapToDto(payment, t);
        }

        // =============================================
        // Get all
        // =============================================

        public async Task<List<RentPaymentDto>> GetAllAsync()
        {
            _logger.LogInformation("Getting all payments");

            // Load all active tenancies and auto-generate for each
            var activeTenancies = await _appDbContext.Tenancies
                .Where(t => t.Status == TenancyStatus.Active)
                .ToListAsync();

            foreach (var tenancy in activeTenancies)
            {
                await EnsureMonthlyPaymentsGeneratedAsync(tenancy);
                await MarkOverduePaymentsAsync(tenancy.Id);
            }

            // Return all payments across all tenancies
            var payments = await _appDbContext.RentPayments
                .OrderByDescending(r => r.DueDate)
                .ToListAsync();

            return payments.Select(p => MapToDto(p, p.Tenancy)).ToList();
        }

        // =============================================
        // Get overdue
        // =============================================

        public async Task<List<RentPaymentDto>> GetOverdueAsync()
        {
            _logger.LogInformation("Getting all overdue payments");

            // Mark any pending past-due payments globally
            var toMark = await _appDbContext.RentPayments
                .Where(r =>
                    r.Status == PaymentStatus.Pending &&
                    r.DueDate < DateTime.UtcNow)
                .ToListAsync();

            if (toMark.Any())
            {
                toMark.ForEach(p => p.Status = PaymentStatus.Overdue);
                await _appDbContext.SaveChangesAsync();
            }

            var payments = await _appDbContext.RentPayments
               
                .Where(r => r.Status == PaymentStatus.Overdue)
                .OrderBy(r => r.DueDate)
                .ToListAsync();

            return payments.Select(p => MapToDto(p, p.Tenancy)).ToList();
        }

        // =============================================
        // Add (manual — landlord / admin)
        // =============================================

        public async Task<RentPaymentDto?> AddAsync(AddRentPaymentDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation(
                "Adding manual rent payment for tenancy {0}", dto.TenancyId);

            var tenancy = await _appDbContext.Tenancies
                .FirstOrDefaultAsync(t => t.Id == dto.TenancyId);

            if (tenancy == null)
                throw new NotFoundException(nameof(AddAsync), dto.TenancyId);

            // Guard: don't allow a second payment for the same month
            var sameMonth = await _appDbContext.RentPayments.AnyAsync(r =>
                r.TenancyId == dto.TenancyId &&
                r.DueDate.Year == dto.DueDate.Year &&
                r.DueDate.Month == dto.DueDate.Month);

            if (sameMonth)
                throw new BadRequestException(
                    $"A payment already exists for {dto.DueDate:MMMM yyyy} on this tenancy.");

            var entity = new RentPayment
            {
                TenancyId = dto.TenancyId,
                Amount = dto.Amount,
                DueDate = new DateTime(dto.DueDate.Year, dto.DueDate.Month, 1,
                                          0, 0, 0, DateTimeKind.Utc),
                Status = PaymentStatus.Pending,
                ReceiptUrl = string.Empty,
            };

            await _appDbContext.RentPayments.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation(
                "Rent payment {0} added successfully for tenancy {1}",
                entity.Id, dto.TenancyId);

            var result = MapToDto(entity, tenancy);
            await afterInsert(result);
            return result;
        }

        // =============================================
        // Mark as paid
        // =============================================

        public async Task<RentPaymentDto> MarkAsPaidAsync(MarkRentPaidDto dto)
        {
            _logger.LogInformation("Marking payment {0} as paid", dto.RentPaymentId);

            var payment = await _appDbContext.RentPayments
                
                .FirstOrDefaultAsync(r => r.Id == dto.RentPaymentId);

            if (payment == null)
                throw new NotFoundException(nameof(MarkAsPaidAsync), dto.RentPaymentId);

            if (payment.Status == PaymentStatus.Paid)
                throw new BadRequestException("This payment has already been marked as paid.");

            payment.Status = PaymentStatus.Paid;
            payment.PaidAt = DateTime.UtcNow;

            // Save first so we have a PaidAt timestamp for the receipt
            await _appDbContext.SaveChangesAsync();

            var tenancy = await _appDbContext.Tenancies
               .FirstOrDefaultAsync(t => t.Id == payment.TenancyId);

            // Generate and upload receipt PDF
            try
            {

               

                var receiptUrl = await _receiptGenerator
                    .GenerateAndUploadReceiptAsync(payment, tenancy);

                payment.ReceiptUrl = receiptUrl;
                await _appDbContext.SaveChangesAsync();

                _logger.LogInformation(
                    "Receipt generated and saved for payment {0}: {1}",
                    payment.Id, receiptUrl);
            }
            catch (Exception ex)
            {
                // Don't fail the payment if receipt generation fails
                // Fall back to a reference number
                _logger.LogInformation(
                    "Receipt generation failed for payment {0}: {1}. Using fallback ref.",
                    payment.Id, ex.Message);

                payment.ReceiptUrl =
                    $"VSTAY-{payment.TenancyId}-{payment.PaidAt:yyyyMMdd}-{payment.Id}";
                await _appDbContext.SaveChangesAsync();
            }

            

            _logger.LogInformation("Payment {0} marked as paid successfully", payment.Id);
            return MapToDto(payment, tenancy);
        }

        // =============================================
        // Delete
        // =============================================

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Deleting payment with id {0}", id);

            var dto = await GetByIdAsync(id);
            var canDelete = await onDelete(dto);
            if (!canDelete) return false;

            var entity = await _appDbContext.RentPayments.FindAsync(id);
            _appDbContext.RentPayments.Remove(entity!);
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Payment {0} deleted successfully", id);
            await afterDelete(dto);
            return true;
        }

        // =============================================
        // Cleanup duplicates (admin one-time fix)
        // =============================================

        public async Task<int> CleanupDuplicatePaymentsAsync()
        {
            _logger.LogInformation("Running global duplicate payment cleanup");

            var all = await _appDbContext.RentPayments
                .OrderBy(p => p.Id)
                .ToListAsync();

            var duplicates = all
                .GroupBy(p => new { p.TenancyId, p.DueDate.Year, p.DueDate.Month })
                .Where(g => g.Count() > 1)
                .SelectMany(g => g.Skip(1)) // keep earliest id per group
                .ToList();

            if (!duplicates.Any())
            {
                _logger.LogInformation("No duplicate payments found");
                return 0;
            }

            _logger.LogInformation("Removing {0} duplicate payment(s)", duplicates.Count);
            _appDbContext.RentPayments.RemoveRange(duplicates);
            await _appDbContext.SaveChangesAsync();

            return duplicates.Count;
        }

        // =============================================
        // Events
        // =============================================

        public Task<bool> onInsert(AddRentPaymentDto dto) => Task.FromResult(true);
        public Task<bool> onUpdate(RentPaymentDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(RentPaymentDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(RentPaymentDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(RentPaymentDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(RentPaymentDto dto) => Task.FromResult(true);
    }
}