using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static ko.core.Exceptions.ApiException;

namespace ko.core.Services
{
    public class MaintenanceRequestService : IMaintenanceRequestService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<MaintenanceRequest> _genericService;
        private readonly IAppLogger<MaintenanceRequestService> _logger;
        private readonly IMapper _mapper;
        private readonly IEmailServiceMailJet _emailServiceMailJet;
        private readonly INotificationService _notificationService; // 👈 added
        private readonly UserManager<ApplicationUser> _userManager;  // 👈 added
        private readonly IConfiguration _configuration;              // 👈 added

        public MaintenanceRequestService(
            AppDbContext appDbContext,
            IGenericService<MaintenanceRequest> genericService,
            IAppLogger<MaintenanceRequestService> logger,
            IMapper mapper,
            IEmailServiceMailJet emailServiceMailJet,
            INotificationService notificationService,              // 👈 added
            UserManager<ApplicationUser> userManager,              // 👈 added
            IConfiguration configuration)                         // 👈 added
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
            _emailServiceMailJet = emailServiceMailJet;
            _notificationService = notificationService;            // 👈 added
            _userManager = userManager;                    // 👈 added
            _configuration = configuration;                  // 👈 added
        }

        // =============================================
        // CRUD
        // =============================================

        public async Task<MaintenanceRequestDto?> AddAsync(
            string studentId, AddMaintenanceRequestDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation(
                "Adding maintenance request for student {0}", studentId);

            var entity = _mapper.Map<MaintenanceRequest>(dto);
            entity.StudentId = studentId;
            entity.Status = MaintenanceStatus.Open;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.MaintenanceRequests.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<MaintenanceRequestDto>(entity);
            _logger.LogInformation(
                "Maintenance request {0} added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<bool> MarkAsResolvedAsync(
            UpdateMaintenanceRequestDto updateMaintenanceRequestDto)
        {
            updateMaintenanceRequestDto.Status = MaintenanceStatus.Resolved;
            await _genericService.UpdateAsync(
                updateMaintenanceRequestDto.Id, updateMaintenanceRequestDto);

            // ✅ Get request details for notification + email
            var entity = await _appDbContext.MaintenanceRequests
                .FirstOrDefaultAsync(m => m.Id == updateMaintenanceRequestDto.Id);

            if (entity != null)
            {
                // Push notification to student
                await _notificationService.SendToUserAsync(
                    userId: entity.StudentId,
                    title: "🔧 Maintenance Request Resolved",
                    message: $"Your maintenance request '{entity.Title}' " +
                             "has been resolved by your landlord.",
                    type: "maintenance");

                // Send feedback email
                await SendMaintenanceFeedbackEmailAsync(entity, updateMaintenanceRequestDto);
            }

            return true;
        }

        // =============================================
        // GET methods
        // =============================================

        public async Task<List<MaintenanceRequestDto>> GetAllAsync()
        {
            _logger.LogInformation(
                "Retrieving all maintenance requests from the database");
            var data = await _appDbContext.MaintenanceRequests.ToListAsync();
            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<MaintenanceRequestDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation(
                "Attempting to retrieve maintenance request with id {0}", id);

            var entity = await _appDbContext.MaintenanceRequests
                .FirstOrDefaultAsync(m => m.Id == id);

            if (entity == null)
                throw new NotFoundException(nameof(GetByIdAsync), id);

            return _mapper.Map<MaintenanceRequestDto>(entity);
        }

        public async Task<List<MaintenanceRequestDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation(
                "Retrieving maintenance requests for student {0}", studentId);

            var data = await _appDbContext.MaintenanceRequests
                .Where(m => m.StudentId == studentId)
                .OrderByDescending(m => m.DateCreated)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<List<MaintenanceRequestDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation(
                "Retrieving maintenance requests for property {0}", propertyId);

            var data = await _appDbContext.MaintenanceRequests
                .Include(m => m.Student)
                .Where(m => m.PropertyId == propertyId)
                .OrderByDescending(m => m.DateCreated)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<List<MaintenanceRequestDto>> GetOpenMantainanceByPropertiesAsync(
            List<PropertyDto> properties)
        {
            _logger.LogInformation(
                "Retrieving open maintenance requests for properties");

            var data = await _appDbContext.MaintenanceRequests
                .Where(m => m.Status == MaintenanceStatus.Open
                         && properties.Select(s => s.Id).Contains(m.PropertyId))
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<List<MaintenanceRequestDto>> GetMantainanceByPropertiesAsync(
            List<PropertyDto> properties)
        {
            _logger.LogInformation(
                "Retrieving maintenance requests for properties");

            var data = await _appDbContext.MaintenanceRequests
                .Where(m => properties.Select(s => s.Id).Contains(m.PropertyId))
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return _mapper.Map<List<MaintenanceRequestDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation(
                "Attempting to delete maintenance request with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation(
                "Maintenance request {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        // ✅ Uncommented and completed UpdateStatusAsync
        public async Task<bool> UpdateStatusAsync(
            int id, MaintenanceStatus status, string? landlordNotes)
        {
            _logger.LogInformation(
                "Updating status of maintenance request {0} to {1}", id, status);

            var entity = await _appDbContext.MaintenanceRequests.FindAsync(id);
            if (entity == null)
                throw new NotFoundException(nameof(UpdateStatusAsync), id);

            var mapped = _mapper.Map<MaintenanceRequestDto>(entity);
            var canUpdate = await onUpdate(mapped);
            if (!canUpdate) return false;

            var previousStatus = entity.Status;
            entity.Status = status;
            entity.LandlordResponse = landlordNotes;

            if (status == MaintenanceStatus.Resolved)
                entity.DateModified = DateTime.UtcNow;

            await _appDbContext.SaveChangesAsync();
            _logger.LogInformation(
                "Maintenance request {0} status updated to {1}", id, status);

            // ✅ Push notification to student on status change
            string title = string.Empty;
            string message = string.Empty;

            switch (status)
            {
                case MaintenanceStatus.InProgress:
                    title = "🔧 Maintenance In Progress";
                    message = $"Your request '{entity.Title}' is now being attended to.";
                    break;
                case MaintenanceStatus.Resolved:
                    title = "✅ Maintenance Request Resolved";
                    message = $"Your request '{entity.Title}' has been resolved." +
                              (string.IsNullOrEmpty(landlordNotes)
                                  ? ""
                                  : $" Note: {landlordNotes}");
                    break;
            }

            if (!string.IsNullOrEmpty(title))
            {
                await _notificationService.SendToUserAsync(
                    userId: entity.StudentId,
                    title: title,
                    message: message,
                    type: "maintenance");
            }

            await afterUpdate(_mapper.Map<MaintenanceRequestDto>(entity));
            return true;
        }

        // =============================================
        // Email Helpers
        // =============================================

        private async Task SendMaintenanceFeedbackEmailAsync(
            MaintenanceRequest entity,
            UpdateMaintenanceRequestDto dto)
        {
            try
            {
                var student = await _userManager.FindByIdAsync(entity.StudentId);
                if (student == null || string.IsNullOrEmpty(student.Email)) return;

                var subject = $"VeriStay — Maintenance Request Resolved 🔧";
                var body = $@"
                    <html><head><style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333;
                               margin: 0; padding: 0; background-color: #f4f4f4; }}
                        .wrapper {{ background-color: #f4f4f4; padding: 40px 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff;
                                     border-radius: 8px; overflow: hidden;
                                     box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
                        .header {{ background-color: #1a1a2e; padding: 30px 40px; text-align: center; }}
                        .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }}
                        .header span {{ color: #4f8ef7; }}
                        .body {{ padding: 40px; }}
                        .highlight-box {{ background-color: #d1fae5; border-left: 4px solid #059669;
                                         border-radius: 4px; padding: 16px 20px; margin: 24px 0;
                                         font-size: 14px; color: #065f46; }}
                        .detail-box {{ background-color: #f8f9fa; border: 1px dashed #ccc;
                                      border-radius: 6px; padding: 16px 20px; margin: 20px 0;
                                      font-size: 14px; }}
                        .step-item {{ display: flex; align-items: flex-start;
                                     margin-bottom: 12px; font-size: 14px; }}
                        .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                        .button {{ display: inline-block; padding: 14px 32px;
                                  background-color: #059669; color: #ffffff !important;
                                  text-decoration: none; border-radius: 6px;
                                  font-weight: bold; font-size: 15px; margin: 8px 0 24px 0; }}
                        .footer {{ background-color: #f9f9f9; padding: 24px 40px;
                                  text-align: center; font-size: 12px; color: #999; }}
                    </style></head>
                    <body><div class='wrapper'><div class='container'>
                        <div class='header'><h1>Veri<span>Stay</span></h1></div>
                        <div class='body'>
                            <h2>Maintenance Request Resolved ✅</h2>
                            <p>Dear <strong>{student.FullName}</strong>,</p>
                            <p>Your maintenance request has been marked as <strong>resolved</strong>.</p>
                            <div class='highlight-box'>
                                ✅ <strong>Issue resolved.</strong> If you are still experiencing 
                                the issue or have any concerns, please submit a new request 
                                from your dashboard.
                            </div>
                            <div class='detail-box'>
                                <div class='step-item'>
                                    <span class='step-icon'>🔧</span>
                                    <span><strong>Request:</strong> {entity.Title}</span>
                                </div>
                                <div class='step-item'>
                                    <span class='step-icon'>📝</span>
                                    <span><strong>Description:</strong> {entity.Description}</span>
                                </div>
                                <div class='step-item'>
                                    <span class='step-icon'>📅</span>
                                    <span><strong>Resolved on:</strong> {DateTime.UtcNow:dd MMM yyyy}</span>
                                </div>
                                {(string.IsNullOrEmpty(dto.LandlordResponse) ? "" :
                                $@"<div class='step-item'>
                                    <span class='step-icon'>💬</span>
                                    <span><strong>Landlord notes:</strong> {dto.LandlordResponse}</span>
                                </div>")}
                            </div>
                            <div style='text-align:center;'>
                                <a href='{_configuration["Ui:Url"]}dashboard' class='button'>
                                    Go to Dashboard →
                                </a>
                            </div>
                            <p>Warm regards,<br/><strong>The VeriStay Team</strong></p>
                        </div>
                        <div class='footer'>
                            <p>© {DateTime.UtcNow.Year} VeriStay. All rights reserved.</p>
                        </div>
                    </div></div></body></html>";

                await _emailServiceMailJet.SendEmailAsync(
                    new EmailMessage(student.Email, subject, body));
            }
            catch (Exception ex)
            {
                _logger.LogInformation(
                    "Failed to send maintenance feedback email: {0}", ex.Message);
            }
        }

        // =============================================
        // Events
        // =============================================

        public Task<bool> onInsert(AddMaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> afterInsert(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> onUpdate(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(MaintenanceRequestDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(MaintenanceRequestDto dto) => Task.FromResult(true);
    }
}