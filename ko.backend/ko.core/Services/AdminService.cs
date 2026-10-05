using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IAppLogger<AdminService> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailServiceMailJet _emailService;
        private readonly IConfiguration _configuration;

        public AdminService(
            AppDbContext appDbContext,
            IAppLogger<AdminService> logger,
            UserManager<ApplicationUser> userManager,
            IEmailServiceMailJet emailService,
            IConfiguration configuration)
        {
            _appDbContext = appDbContext;
            _logger = logger;
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
        }


        public async Task<List<DisputeDto>> GetAllDisputesAsync()
        {
            _logger.LogInformation("Getting all disputes");
            var disputes = await _appDbContext.Disputes
                .OrderByDescending(d => d.DateCreated)
                .ToListAsync();

            var result = new List<DisputeDto>();
            foreach (var d in disputes)
                result.Add(await ToDisputeDtoAsync(d));
            return result;
        }

        public async Task<List<DisputeDto>> GetDisputesByLandlordAsync(string landlordId)
        {
            _logger.LogInformation("Getting disputes for landlord {0}", landlordId);
            var propertyIds = await GetLandlordPropertyIdsAsync(landlordId);

            // Matching on property as well picks up older disputes whose
            // LandlordId was saved as the landlord's name instead of their id.
            var disputes = await _appDbContext.Disputes
                .Where(d => d.LandlordId == landlordId
                         || (d.PropertyId.HasValue && propertyIds.Contains(d.PropertyId.Value)))
                .OrderByDescending(d => d.DateCreated)
                .ToListAsync();

            var result = new List<DisputeDto>();
            foreach (var d in disputes)
                result.Add(await ToDisputeDtoAsync(d));
            return result;
        }

        public async Task<DisputeDto> RespondToDisputeAsync(int id, LandlordResponseDto dto)
        {
            _logger.LogInformation("Landlord {0} responding to dispute {1}", dto.LandlordId, id);
            var dispute = await _appDbContext.Disputes.FirstOrDefaultAsync(d => d.Id == id);
            if (dispute == null)
                throw new NotFoundException(nameof(RespondToDisputeAsync), id);

            if (!await IsLandlordOfAsync(dto.LandlordId, dispute.LandlordId, dispute.PropertyId))
                throw new ForbiddenException("You can only respond to disputes about your own properties.");

            dispute.LandlordId = dto.LandlordId;
            dispute.LandlordResponse = dto.Response.Trim();
            dispute.LandlordRespondedAt = DateTime.UtcNow;
            await _appDbContext.SaveChangesAsync();

            await NotifyLandlordResponseAsync(dispute.StudentId, "dispute", dispute.Title, dispute.LandlordResponse);
            return await ToDisputeDtoAsync(dispute);
        }

        public async Task<DisputeDto> AddDisputeAsync(AddDisputeDto dto)
        {
            _logger.LogInformation("Adding dispute from student {0}", dto.StudentId);
            var entity = new Dispute
            {
                StudentId = dto.StudentId,
                LandlordId = await ResolveLandlordIdAsync(dto.PropertyId, dto.LandlordId) ?? dto.LandlordId,
                PropertyId = dto.PropertyId,
                Title = dto.Title,
                Description = dto.Description,
                Status = DisputeStatus.Open,
            };
            await _appDbContext.Disputes.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var dashUrl = _configuration["Ui:Url"] ?? "";
            await _emailService.SendEmailAsync(new EmailMessage(
                to: _configuration["Email:From"]!,
                subject: $"VeriStay — New Dispute Filed: {dto.Title}",
                body: $"<p>A new dispute has been filed. Please review it on the <a href='{dashUrl}admin'>Admin Dashboard</a>.</p>"));

            var landlord = await _userManager.FindByIdAsync(entity.LandlordId);
            if (landlord?.Email != null)
                await _emailService.SendEmailAsync(new EmailMessage(
                    to: landlord.Email,
                    subject: $"VeriStay — Dispute Filed: {dto.Title}",
                    body: $@"<p>Dear {landlord.FullName},</p>
                            <p>A tenant has filed a dispute: <strong>{dto.Title}</strong>.</p>
                            <p>You can view it and respond from the Disputes &amp; Complaints tab on your
                            <a href='{dashUrl}dashboard'>dashboard</a>.</p>"));

            return await ToDisputeDtoAsync(entity);
        }

        public async Task<DisputeDto> ResolveDisputeAsync(ResolveDisputeDto dto)
        {
            _logger.LogInformation("Resolving dispute {0}", dto.DisputeId);
            var dispute = await _appDbContext.Disputes
                .FirstOrDefaultAsync(d => d.Id == dto.DisputeId);

            if (dispute == null)
                throw new NotFoundException(nameof(ResolveDisputeAsync), dto.DisputeId);

            dispute.Status = dto.Status;
            dispute.Resolution = dto.Resolution;
            dispute.AdminNotes = dto.AdminNotes;
            dispute.ResolvedAt = DateTime.UtcNow;
            await _appDbContext.SaveChangesAsync();

            var student = await _userManager.FindByIdAsync(dispute.StudentId);
            if (student?.Email != null)
                await _emailService.SendEmailAsync(new EmailMessage(
                    to: student.Email,
                    subject: "VeriStay — Your Dispute Has Been Resolved",
                    body: $@"<p>Dear {student.FullName},</p>
                            <p>Your dispute <strong>{dispute.Title}</strong> has been resolved.</p>
                            <p><strong>Resolution:</strong> {dto.Resolution}</p>
                            <p>Thank you for using VeriStay.</p>"));

            return await ToDisputeDtoAsync(dispute);
        }


        public async Task<List<ComplaintDto>> GetAllComplaintsAsync()
        {
            _logger.LogInformation("Getting all complaints");
            var complaints = await _appDbContext.Complaints
                .Include(c => c.Property)
                .OrderByDescending(c => c.DateCreated)
                .ToListAsync();

            var result = new List<ComplaintDto>();
            foreach (var c in complaints)
                result.Add(await ToComplaintDtoAsync(c));
            return result;
        }

        public async Task<List<ComplaintDto>> GetComplaintsByLandlordAsync(string landlordId)
        {
            _logger.LogInformation("Getting complaints for landlord {0}", landlordId);
            var propertyIds = await GetLandlordPropertyIdsAsync(landlordId);

            var complaints = await _appDbContext.Complaints
                .Include(c => c.Property)
                .Where(c => c.LandlordId == landlordId
                         || (c.PropertyId.HasValue && propertyIds.Contains(c.PropertyId.Value)))
                .OrderByDescending(c => c.DateCreated)
                .ToListAsync();

            var result = new List<ComplaintDto>();
            foreach (var c in complaints)
                result.Add(await ToComplaintDtoAsync(c));
            return result;
        }

        public async Task<ComplaintDto> RespondToComplaintAsync(int id, LandlordResponseDto dto)
        {
            _logger.LogInformation("Landlord {0} responding to complaint {1}", dto.LandlordId, id);
            var complaint = await _appDbContext.Complaints
                .Include(c => c.Property)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (complaint == null)
                throw new NotFoundException(nameof(RespondToComplaintAsync), id);

            if (!await IsLandlordOfAsync(dto.LandlordId, complaint.LandlordId, complaint.PropertyId))
                throw new ForbiddenException("You can only respond to complaints about your own properties.");

            complaint.LandlordId = dto.LandlordId;
            complaint.LandlordResponse = dto.Response.Trim();
            complaint.LandlordRespondedAt = DateTime.UtcNow;
            await _appDbContext.SaveChangesAsync();

            await NotifyLandlordResponseAsync(complaint.SubmittedById, "complaint", complaint.Title, complaint.LandlordResponse);
            return await ToComplaintDtoAsync(complaint);
        }

        public async Task<ComplaintDto> AddComplaintAsync(AddComplaintDto dto)
        {
            _logger.LogInformation("Adding complaint from {0}", dto.SubmittedById);
            var entity = new Complaint
            {
                SubmittedById = dto.SubmittedById,
                LandlordId = await ResolveLandlordIdAsync(dto.PropertyId, dto.LandlordId),
                PropertyId = dto.PropertyId,
                Type = dto.Type,
                Title = dto.Title,
                Description = dto.Description,
                Status = ComplaintStatus.Open,
            };
            await _appDbContext.Complaints.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var dashUrl = _configuration["Ui:Url"] ?? "";
            await _emailService.SendEmailAsync(new EmailMessage(
                to: _configuration["Email:From"]!,
                subject: $"VeriStay — New Complaint: {dto.Title}",
                body: $"<p>A new complaint has been filed. Review it on the <a href='{dashUrl}admin'>Admin Dashboard</a>.</p>"));

            return await ToComplaintDtoAsync(entity);
        }

        public async Task<ComplaintDto> UpdateComplaintStatusAsync(
            int id, ComplaintStatus status, string adminNotes)
        {
            var complaint = await _appDbContext.Complaints
                .FirstOrDefaultAsync(c => c.Id == id);

            if (complaint == null)
                throw new NotFoundException(nameof(UpdateComplaintStatusAsync), id);

            complaint.Status = status;
            complaint.AdminNotes = adminNotes;
            await _appDbContext.SaveChangesAsync();

            var submittedBy = await _userManager.FindByIdAsync(complaint.SubmittedById);
            if (submittedBy?.Email != null)
                await _emailService.SendEmailAsync(new EmailMessage(
                    to: submittedBy.Email,
                    subject: "VeriStay — Complaint Status Update",
                    body: $@"<p>Dear {submittedBy.FullName},</p>
                            <p>Your complaint <strong>{complaint.Title}</strong> 
                            status has been updated to <strong>{status}</strong>.</p>
                            {(!string.IsNullOrEmpty(adminNotes)
                                    ? $"<p><strong>Admin Notes:</strong> {adminNotes}</p>"
                                    : "")}"));

            return new ComplaintDto
            {
                Id = complaint.Id,
                SubmittedById = complaint.SubmittedById,
                SubmittedByName = submittedBy?.FullName ?? complaint.SubmittedById,
                Type = complaint.Type,
                Title = complaint.Title,
                Description = complaint.Description,
                Status = complaint.Status,
                AdminNotes = complaint.AdminNotes,
                IsNotified = complaint.IsNotified,
            };
        }

        public async Task<bool> NotifyComplaintAsync(int complaintId)
        {
            var complaint = await _appDbContext.Complaints
                .FirstOrDefaultAsync(c => c.Id == complaintId);

            if (complaint == null)
                throw new NotFoundException(nameof(NotifyComplaintAsync), complaintId);

            if (!string.IsNullOrEmpty(complaint.LandlordId))
            {
                var landlord = await _userManager.FindByIdAsync(complaint.LandlordId);
                if (landlord?.Email != null)
                    await _emailService.SendEmailAsync(new EmailMessage(
                        to: landlord.Email,
                        subject: "VeriStay — Complaint Filed Against Your Property",
                        body: $@"<p>Dear {landlord.FullName},</p>
                                <p>A complaint has been filed regarding your property on VeriStay.</p>
                                <p><strong>Type:</strong> {complaint.Type}</p>
                                <p><strong>Title:</strong> {complaint.Title}</p>
                                <p>Our admin team is reviewing this complaint. You can respond to it from the
                                Disputes &amp; Complaints tab on your dashboard.</p>"));
            }

            complaint.IsNotified = true;
            await _appDbContext.SaveChangesAsync();
            return true;
        }


        private async Task<DisputeDto> ToDisputeDtoAsync(Dispute d)
        {
            var student = await _userManager.FindByIdAsync(d.StudentId);
            var landlord = string.IsNullOrEmpty(d.LandlordId)
                ? null
                : await _userManager.FindByIdAsync(d.LandlordId);
            var propertyTitle = d.PropertyId.HasValue
                ? await _appDbContext.Properties
                    .Where(p => p.Id == d.PropertyId.Value)
                    .Select(p => p.Title)
                    .FirstOrDefaultAsync()
                : null;

            return new DisputeDto
            {
                Id = d.Id,
                StudentId = d.StudentId,
                StudentName = student?.FullName ?? d.StudentId,
                StudentEmail = student?.Email ?? string.Empty,
                LandlordId = d.LandlordId,
                LandlordName = landlord?.FullName ?? d.LandlordId,
                LandlordEmail = landlord?.Email ?? string.Empty,
                PropertyId = d.PropertyId,
                PropertyTitle = propertyTitle ?? string.Empty,
                Title = d.Title,
                Description = d.Description,
                Status = d.Status,
                AdminNotes = d.AdminNotes,
                Resolution = d.Resolution,
                ResolvedAt = d.ResolvedAt,
                CreatedAt = d.DateCreated ?? default,
                LandlordResponse = d.LandlordResponse,
                LandlordRespondedAt = d.LandlordRespondedAt,
            };
        }

        private async Task<ComplaintDto> ToComplaintDtoAsync(Complaint c)
        {
            var submittedBy = await _userManager.FindByIdAsync(c.SubmittedById);
            var landlord = string.IsNullOrEmpty(c.LandlordId)
                ? null
                : await _userManager.FindByIdAsync(c.LandlordId);

            return new ComplaintDto
            {
                Id = c.Id,
                SubmittedById = c.SubmittedById,
                SubmittedByName = submittedBy?.FullName ?? c.SubmittedById,
                LandlordId = c.LandlordId ?? string.Empty,
                LandlordName = landlord?.FullName ?? c.LandlordId ?? string.Empty,
                PropertyId = c.PropertyId,
                PropertyTitle = c.Property?.Title ?? string.Empty,
                Type = c.Type,
                Status = c.Status,
                Title = c.Title,
                Description = c.Description,
                AdminNotes = c.AdminNotes,
                IsNotified = c.IsNotified,
                CreatedAt = c.DateCreated ?? default,
                LandlordResponse = c.LandlordResponse,
                LandlordRespondedAt = c.LandlordRespondedAt,
            };
        }

        private Task<List<int>> GetLandlordPropertyIdsAsync(string landlordId) =>
            _appDbContext.Properties
                .Where(p => p.LandlordId == landlordId)
                .Select(p => p.Id)
                .ToListAsync();

        // The property owner is the source of truth for who a dispute/complaint is against;
        // the id supplied by the client is only used when no property is linked.
        private async Task<string?> ResolveLandlordIdAsync(int? propertyId, string? suppliedLandlordId)
        {
            if (propertyId.HasValue)
            {
                var ownerId = await _appDbContext.Properties
                    .Where(p => p.Id == propertyId.Value)
                    .Select(p => p.LandlordId)
                    .FirstOrDefaultAsync();
                if (!string.IsNullOrEmpty(ownerId)) return ownerId;
            }
            return string.IsNullOrWhiteSpace(suppliedLandlordId) ? null : suppliedLandlordId;
        }

        private async Task<bool> IsLandlordOfAsync(string landlordId, string? storedLandlordId, int? propertyId)
        {
            if (storedLandlordId == landlordId) return true;
            return propertyId.HasValue && await _appDbContext.Properties
                .AnyAsync(p => p.Id == propertyId.Value && p.LandlordId == landlordId);
        }

        private async Task NotifyLandlordResponseAsync(
            string studentId, string kind, string title, string response)
        {
            try
            {
                var body = $@"<p>The landlord has responded to the {kind} <strong>{title}</strong>.</p>
                              <p><strong>Landlord response:</strong> {response}</p>";

                var student = await _userManager.FindByIdAsync(studentId);
                if (student?.Email != null)
                    await _emailService.SendEmailAsync(new EmailMessage(
                        to: student.Email,
                        subject: $"VeriStay — Landlord Responded to Your {kind}",
                        body: $"<p>Dear {student.FullName},</p>{body}"));

                await _emailService.SendEmailAsync(new EmailMessage(
                    to: _configuration["Email:From"]!,
                    subject: $"VeriStay — Landlord Responded to {kind}: {title}",
                    body: body));
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Failed to send landlord response email: {0}", ex.Message);
            }
        }


        public async Task<List<UserAccountDto>> GetAllUsersAsync()
        {
            _logger.LogInformation("Getting all user accounts");
            var users = await _userManager.Users.ToListAsync();
            var result = new List<UserAccountDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new UserAccountDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    Role = roles.FirstOrDefault() ?? "Unknown",
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                });
            }

            return result.OrderByDescending(u => u.CreatedAt).ToList();
        }

        public async Task<bool> ToggleUserActiveAsync(string userId)
        {
            _logger.LogInformation("Toggling active status for user {0}", userId);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new NotFoundException(nameof(ToggleUserActiveAsync), userId);

            user.IsActive = !user.IsActive;
            await _userManager.UpdateAsync(user);

            _logger.LogInformation(
                "User {0} is now {1}", userId, user.IsActive ? "active" : "inactive");
            return user.IsActive;
        }

        public async Task<bool> SuspendLandlordAsync(SuspendLandlordDto dto)
        {
            _logger.LogInformation(
                "{0} landlord {1}",
                dto.IsSuspended ? "Suspending" : "Reinstating",
                dto.LandlordId);

            var landlord = await _userManager.FindByIdAsync(dto.LandlordId);
            if (landlord == null)
                throw new NotFoundException(nameof(SuspendLandlordAsync), dto.LandlordId);

            landlord.IsActive = !dto.IsSuspended;
            await _userManager.UpdateAsync(landlord);

            if (dto.IsSuspended)
            {
                var properties = await _appDbContext.Properties
                    .Where(p => p.LandlordId == dto.LandlordId)
                    .ToListAsync();
                properties.ForEach(p => p.Status = PropertyStatus.Delisted);
                await _appDbContext.SaveChangesAsync();
            }

            if (landlord.Email != null)
                await _emailService.SendEmailAsync(new EmailMessage(
                    to: landlord.Email,
                    subject: dto.IsSuspended
                        ? "VeriStay — Account Suspended"
                        : "VeriStay — Account Reinstated",
                    body: dto.IsSuspended
                        ? $@"<p>Dear {landlord.FullName},</p>
                         <p>Your VeriStay account has been suspended.</p>
                         <p><strong>Reason:</strong> {dto.Reason}</p>
                         <p>If you believe this is an error, please contact support.</p>"
                        : $@"<p>Dear {landlord.FullName},</p>
                         <p>Your VeriStay account has been reinstated. 
                         You may now log in and relist your properties.</p>"));

            return true;
        }


        public async Task<AccommodationReportDto> GetAccommodationReportAsync()
        {
            _logger.LogInformation("Generating accommodation report");

            var properties = await _appDbContext.Properties.ToListAsync();
            var tenancies = await _appDbContext.Tenancies
                .Where(t => t.Status == TenancyStatus.Active).ToListAsync();
            var students = await _userManager.GetUsersInRoleAsync("Student");
            var landlords = await _userManager.GetUsersInRoleAsync("Landlord");
            var disputes = await _appDbContext.Disputes
                .CountAsync(d => d.Status == DisputeStatus.Open);
            var complaints = await _appDbContext.Complaints
                .CountAsync(c => c.Status == ComplaintStatus.Open);
            var suspended = landlords.Count(l => !l.IsActive);

            var approved = properties.Where(p => p.Status == PropertyStatus.Approved).ToList();
            var totalBeds = approved.Sum(p => p.AvailableBeds > 100 ? 0 : p.AvailableBeds);
            var occupiedBeds = tenancies.Count;
            var availBeds = Math.Max(0, totalBeds - occupiedBeds);
            var occupancyRate = totalBeds > 0
                ? Math.Round((decimal)occupiedBeds / totalBeds * 100, 1)
                : 0;

            var cityBreakdown = approved
                .GroupBy(p => p.City)
                .Select(g =>
                {
                    var cityBeds = g.Sum(p => p.AvailableBeds > 100 ? 0 : p.AvailableBeds);
                    var cityTenancies = tenancies.Count(t =>
                        g.Any(p => p.Id == t.PropertyId));
                    return new CityReportDto
                    {
                        City = g.Key,
                        PropertyCount = g.Count(),
                        TotalBeds = cityBeds,
                        OccupiedBeds = cityTenancies,
                        OccupancyRate = cityBeds > 0
                            ? Math.Round((decimal)cityTenancies / cityBeds * 100, 1)
                            : 0,
                    };
                })
                .OrderByDescending(c => c.PropertyCount)
                .ToList();

           



            return new AccommodationReportDto
            {
                TotalProperties = properties.Count,
                ApprovedProperties = approved.Count,
                PendingProperties = properties.Count(p => p.Status == PropertyStatus.PendingApproval),
                TotalBeds = totalBeds,
                OccupiedBeds = occupiedBeds,
                AvailableBeds = availBeds,
                OccupancyRate = occupancyRate,
                TotalStudents = students.Count,
                HousedStudents = occupiedBeds,
                OpenDisputes = disputes,
                OpenComplaints = complaints,
                SuspendedLandlords = suspended,
                CityBreakdown = cityBreakdown,

            };
        }
    }

}
