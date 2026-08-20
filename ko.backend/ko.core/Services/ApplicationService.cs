using AutoMapper;
using FirebaseAdmin.Messaging;
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
    public class ApplicationService : IApplicationService
    {
        private readonly AppDbContext _appDbContext;
        private readonly IGenericService<Application> _genericService;
        private readonly IAppLogger<ApplicationService> _logger;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPropertyService _propertyService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly ITenancyService _tenancyService;
        private readonly IEmailServiceMailJet _emailServiceMailJet;
        private readonly IFileUploadService _fileUploadService;
        private readonly INotificationService _notificationService;

        public ApplicationService(
            AppDbContext appDbContext,
            IGenericService<Application> genericService,
            IAppLogger<ApplicationService> logger,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            IPropertyService propertyService,
            IEmailService emailService,
            IConfiguration configuration,
            ITenancyService tenancyService,
            IEmailServiceMailJet emailServiceMailJet,
            IFileUploadService fileUploadService,
            INotificationService notificationService)
        {
            _appDbContext = appDbContext;
            _genericService = genericService;
            _logger = logger;
            _mapper = mapper;
            _userManager = userManager;
            _propertyService = propertyService;
            _emailService = emailService;
            _configuration = configuration;
            _tenancyService = tenancyService;
            _emailServiceMailJet = emailServiceMailJet;
            _fileUploadService = fileUploadService;
            _notificationService = notificationService;
        }

        // =============================================
        // CRUD
        // =============================================

        public async Task<ApplicationDto?> AddAsync(string studentId, AddApplicationDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation(
                "Adding application for student {0} to the database", studentId);

            bool isActive = await IsActiveUserAsync(studentId);
            if (!isActive)
                throw new BadRequestException(
                    "Application Failed. Your account is not active. Contact admin.");

            var entity = _mapper.Map<Application>(dto);
            entity.StudentId = studentId;
            entity.Status = ApplicationStatus.Pending;
            entity.DateCreated = DateTime.UtcNow;

            await _appDbContext.Applications.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<ApplicationDto>(entity);
            _logger.LogInformation(
                "Application with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        private async Task<bool> IsActiveUserAsync(string studentId)
        {
            var user = await _userManager.FindByIdAsync(studentId);
            return user?.IsActive ?? false;
        }

        public async Task<List<ApplicationDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all applications from the database");
            var data = await _appDbContext.Applications.OrderByDescending(o => o.Id).ToListAsync();
            return _mapper.Map<List<ApplicationDto>>(data);
        }

        public async Task<ApplicationDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation(
                "Attempting to retrieve application with id {0}", id);

            var entity = await _appDbContext.Applications
                .Include(a => a.Student)
                .Include(a => a.Property)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (entity == null)
                throw new NotFoundException(nameof(GetByIdAsync), id);

            return _mapper.Map<ApplicationDto>(entity);
        }

        public async Task<StudentApplication?> ViewStudentApplicationByIdAsync(int applicationId)
        {
            _logger.LogInformation(
                "Attempting to retrieve application with id {0}", applicationId);

            var entity = await _appDbContext.Applications
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (entity == null)
                throw new NotFoundException(nameof(ViewStudentApplicationByIdAsync), applicationId);

            var property = await _propertyService.GetByIdAsync(entity.PropertyId);
            var studentApplication = _mapper.Map<StudentApplication>(entity);
            var user = await _userManager.FindByIdAsync(entity.StudentId);

            studentApplication.StudentName = user.FullName;
            studentApplication.Price = property.MonthlyRent;
            studentApplication.PropertyDescription = property.Description;
            studentApplication.PropertyTitle = property.Title;
            studentApplication.PropertyLocation = property.Address + " - " + property.City;
            studentApplication.ProofOfIncomeUrl =
                await _fileUploadService.GetSignedUrlAsync("uploads", user.ProofOfIncomeUrl);
            studentApplication.ProofOfRegistrationUrl =
                await _fileUploadService.GetSignedUrlAsync("uploads", user.ProofOfRegistrationUrl);

            return studentApplication;
        }

        public async Task<List<ApplicationDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation(
                "Retrieving applications for student {0}", studentId);

            var data = await _appDbContext.Applications
                .Include(a => a.Property)
                .Where(a => a.StudentId == studentId)
                .ToListAsync();

            var applicationDtos = _mapper.Map<List<ApplicationDto>>(data);
            foreach (var item in applicationDtos)
            {
                var property = await _propertyService.GetByIdAsync(item.PropertyId);
                var landlord = await _userManager.FindByIdAsync(property.LandlordId);
                item.PropertyDescription = property.Description;
                item.Price = property.MonthlyRent;
                item.PropertyLocation = $"{property.Address} - {property.City}";
                item.LandlordName = landlord.FullName;
            }
            return applicationDtos;
        }

        public async Task<List<ApplicationDto>> GetByLandlordIdAsync(string landlordId)
        {
            _logger.LogInformation(
                "Retrieving applications for landlord {0}", landlordId);

            var properties = await _propertyService.GetByLandlordIdAsync(landlordId);
            if (properties == null || properties.Count <= 0)
                return new List<ApplicationDto>();

            var data = await _appDbContext.Applications
                .Where(a => properties.Select(s => s.Id).Contains(a.PropertyId))
                .OrderByDescending(O => O.Id)
                .ToListAsync();

            var applicationDtos = _mapper.Map<List<ApplicationDto>>(data);
            foreach (var item in applicationDtos)
            {
                var property = await _propertyService.GetByIdAsync(item.PropertyId);
                var landlord = await _userManager.FindByIdAsync(property.LandlordId);
                item.PropertyDescription = property.Description;
                item.Price = property.MonthlyRent;
                item.PropertyLocation = $"{property.Address} - {property.City}";
                item.LandlordName = landlord.FullName;
            }
            return applicationDtos;
        }

        public async Task<List<ApplicationDto>> GetByPropertyIdAsync(int propertyId)
        {
            _logger.LogInformation(
                "Retrieving applications for property {0}", propertyId);

            var data = await _appDbContext.Applications
                .Include(a => a.Student)
                .Where(a => a.PropertyId == propertyId)
                .ToListAsync();

            return _mapper.Map<List<ApplicationDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation(
                "Attempting to delete application with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation(
                "Application with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        public async Task<bool> ReviewAsync(ReviewApplicationDto dto)
        {
            _logger.LogInformation(
                "Reviewing application with id {0}", dto.ApplicationId);

            var entity = await _appDbContext.Applications
                .Include(a => a.Property)
                .FirstOrDefaultAsync(a => a.Id == dto.ApplicationId);

            if (entity == null)
                throw new NotFoundException(nameof(ReviewAsync), dto.ApplicationId);

            var mapped = _mapper.Map<ApplicationDto>(entity);
            var canUpdate = await onUpdate(mapped);
            if (!canUpdate) return false;

            entity.Status = dto.Status;
            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation(
                "Application {0} reviewed with status {1}",
                dto.ApplicationId, dto.Status);

            var property = await _propertyService.GetByIdAsync(entity.PropertyId);

            // ✅ Push notification to student
            if (dto.Status == ApplicationStatus.Approved)
            {
                await _notificationService.SendToUserAsync(
                    userId: entity.StudentId,
                    title: "🎉 Application Approved!",
                    message: $"Your application for {property?.Title ?? "a property"} " +
                             "has been approved. Log in to accept the offer.",
                    type: "application");

                // Send approval email to student
                var student = await _userManager.FindByIdAsync(entity.StudentId);
                if (student != null && property != null)
                    await SendApplicationApprovedEmailAsync(student, property, entity);
            }
            else if (dto.Status == ApplicationStatus.Rejected)
            {
                await _notificationService.SendToUserAsync(
                    userId: entity.StudentId,
                    title: "Application Update",
                    message: $"Your application for {property?.Title ?? "a property"} " +
                             "was not approved. Keep searching on VeriStay!",
                    type: "application");

                // Send rejection email to student
                var student = await _userManager.FindByIdAsync(entity.StudentId);
                if (student != null && property != null)
                    await SendApplicationRejectedEmailAsync(student, property, entity);
            }

            await afterUpdate(_mapper.Map<ApplicationDto>(entity));
            return true;
        }

        public async Task<bool> AcceptDeclineOffer(int applicationId, bool isAccepted)
        {
            var entity = await _appDbContext.Applications.FindAsync(applicationId);
            if (entity == null)
                throw new NotFoundException(nameof(AcceptDeclineOffer), applicationId);

            var mapped = _mapper.Map<ApplicationDto>(entity);
            var canUpdate = await onUpdate(mapped);
            if (!canUpdate) return false;

            if (isAccepted)
            {
                entity.Status = ApplicationStatus.Accepted;
                var property = await _propertyService.GetByIdAsync(entity.PropertyId);
                await _appDbContext.SaveChangesAsync();

                await _tenancyService.AddAsync(new AddTenancyDto
                {
                    StudentId = entity.StudentId,
                    LeaseEndDate = mapped.ToDate,
                    LeaseStartDate = mapped.FromDate,
                    PropertyId = entity.PropertyId,
                    MonthlyRent = property.MonthlyRent
                });

                // ✅ Notify student tenancy created
                await _notificationService.SendToUserAsync(
                    userId: entity.StudentId,
                    title: "🏠 Welcome to Your New Home!",
                    message: $"Your tenancy for {property?.Title ?? "your property"} " +
                             "has been created. Check your dashboard.",
                    type: "application");
            }
            else
            {
                entity.Status = ApplicationStatus.Declined;
                await _appDbContext.SaveChangesAsync();

                // ✅ Notify student offer declined
                await _notificationService.SendToUserAsync(
                    userId: entity.StudentId,
                    title: "Offer Declined",
                    message: "You declined the accommodation offer. " +
                             "Continue searching on VeriStay.",
                    type: "application");
            }

            return true;
        }

        // =============================================
        // Events
        // =============================================

        public async Task<bool> onInsert(AddApplicationDto dto)
        {
            await CheckDuplicateApplication(dto);
            return true;
        }

        private async Task CheckDuplicateApplication(AddApplicationDto dto)
        {
            if (await _appDbContext.Applications.AnyAsync(
                    w => w.PropertyId == dto.PropertyId &&
                         w.StudentId == dto.studentId))
            {
                throw new BadRequestException(
                    "Application already exists for this property. " +
                    "Contact the landlord for updates.");
            }
        }

        public async Task<bool> afterInsert(ApplicationDto dto)
        {
            var student = await _userManager.FindByIdAsync(dto.StudentId);
            var property = await _propertyService.GetByIdAsync(dto.PropertyId);
            var landlord = await _userManager.FindByIdAsync(property.LandlordId);

            // Send emails
            if (student != null && property != null)
                await SendApplicationSubmittedEmailAsync(student, property, dto);

            if (landlord != null && student != null && property != null)
                await SendNewApplicationEmailAsync(landlord, student, property, dto);

            // ✅ Push notification to landlord
            if (landlord != null)
            {
                await _notificationService.SendToUserAsync(
                    userId: landlord.Id,
                    title: "📋 New Application Received",
                    message: $"{student?.FullName ?? "A student"} applied for " +
                             $"{property?.Title ?? "your property"}. Review it now.",
                    type: "application");
            }

            return true;
        }

        public Task<bool> onUpdate(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(ApplicationDto dto) => Task.FromResult(true);

        // =============================================
        // Email Helpers
        // =============================================

        private async Task<bool> SendApplicationSubmittedEmailAsync(
            ApplicationUser student, PropertyDto property, ApplicationDto dto)
        {
            var subject = $"VeriStay — Application Submitted for {property.Title} 📩";
            var body = $@"
                <html><head><style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
                    .wrapper {{ background-color: #f4f4f4; padding: 40px 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
                    .header {{ background-color: #1a1a2e; padding: 30px 40px; text-align: center; }}
                    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }} .header span {{ color: #4f8ef7; }}
                    .header p {{ color: #aab4c8; font-size: 13px; margin: 8px 0 0 0; }}
                    .body {{ padding: 40px; }}
                    .highlight-box {{ background-color: #f0f5ff; border-left: 4px solid #4f8ef7; border-radius: 4px; padding: 16px 20px; margin: 24px 0; font-size: 14px; }}
                    .property-box {{ background-color: #f8f9fa; border: 1px dashed #ccc; border-radius: 6px; padding: 16px 20px; margin: 20px 0; font-size: 14px; }}
                    .step-item {{ display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 14px; }}
                    .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                    .button {{ display: inline-block; padding: 14px 32px; background-color: #4f8ef7; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin: 8px 0 24px 0; }}
                    .footer {{ background-color: #f9f9f9; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }}
                    .footer a {{ color: #4f8ef7; text-decoration: none; }}
                </style></head>
                <body><div class='wrapper'><div class='container'>
                    <div class='header'><h1>Veri<span>Stay</span></h1><p>Verified Student Accommodation Platform</p></div>
                    <div class='body'>
                        <h2>Application Submitted! 📩</h2>
                        <p>Dear <strong>{student.FullName}</strong>,</p>
                        <p>Your application has been successfully submitted. The landlord will review it shortly.</p>
                        <div class='highlight-box'>⏳ <strong>What happens now?</strong> The landlord will review your application and you'll receive an email once a decision is made.</div>
                        <div class='property-box'>
                            <div class='step-item'><span class='step-icon'>🏠</span><span><strong>Property:</strong> {property.Title}</span></div>
                            <div class='step-item'><span class='step-icon'>📍</span><span><strong>Location:</strong> {property.Address}, {property.City}</span></div>
                            <div class='step-item'><span class='step-icon'>💰</span><span><strong>Monthly Rent:</strong> R {property.MonthlyRent:N0}</span></div>
                            <div class='step-item'><span class='step-icon'>📅</span><span><strong>Applied on:</strong> {dto.AppliedAt:dd MMM yyyy}</span></div>
                        </div>
                        <div style='text-align:center;'>
                            <a href='{_configuration["Ui:Url"]}dashboard/applications' class='button'>Track Your Application →</a>
                        </div>
                        <p>Warm regards,<br/><strong>The VeriStay Team</strong></p>
                    </div>
                    <div class='footer'>
                        <p>© {DateTime.UtcNow.Year} VeriStay. All rights reserved.</p>
                        <p><a href='{_configuration["Ui:Url"]}'>Visit VeriStay</a> &nbsp;|&nbsp;
                        <a href='mailto:{_configuration["Email:Support"]}'>Support</a></p>
                    </div>
                </div></div></body></html>";

            await _emailServiceMailJet.SendEmailAsync(
                new EmailMessage(student.Email, subject, body));
            return true;
        }

        private async Task<bool> SendNewApplicationEmailAsync(
            ApplicationUser landlord, ApplicationUser student,
            PropertyDto property, ApplicationDto dto)
        {
            var subject = $"VeriStay — New Application for {property.Title} 🔔";
            var body = $@"
                <html><head><style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
                    .wrapper {{ background-color: #f4f4f4; padding: 40px 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
                    .header {{ background-color: #1a1a2e; padding: 30px 40px; text-align: center; }}
                    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }} .header span {{ color: #4f8ef7; }}
                    .body {{ padding: 40px; }}
                    .highlight-box {{ background-color: #fffaf0; border-left: 4px solid #f5a623; border-radius: 4px; padding: 16px 20px; margin: 24px 0; font-size: 14px; }}
                    .applicant-box {{ background-color: #f8f9fa; border: 1px dashed #ccc; border-radius: 6px; padding: 16px 20px; margin: 20px 0; font-size: 14px; }}
                    .step-item {{ display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 14px; }}
                    .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                    .button {{ display: inline-block; padding: 14px 32px; background-color: #4f8ef7; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin: 8px 0 24px 0; }}
                    .footer {{ background-color: #f9f9f9; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }}
                    .footer a {{ color: #4f8ef7; text-decoration: none; }}
                </style></head>
                <body><div class='wrapper'><div class='container'>
                    <div class='header'><h1>Veri<span>Stay</span></h1></div>
                    <div class='body'>
                        <h2>New Application Received 🔔</h2>
                        <p>Dear <strong>{landlord.FullName}</strong>,</p>
                        <p>You've received a new rental application on VeriStay.</p>
                        <div class='highlight-box'>⏳ <strong>Action required.</strong> Please review this application as soon as possible.</div>
                        <div class='applicant-box'>
                            <div class='step-item'><span class='step-icon'>🎓</span><span><strong>Student:</strong> {student.FullName}</span></div>
                            <div class='step-item'><span class='step-icon'>📧</span><span><strong>Email:</strong> {student.Email}</span></div>
                            <div class='step-item'><span class='step-icon'>🏠</span><span><strong>Property:</strong> {property.Title}</span></div>
                            <div class='step-item'><span class='step-icon'>📍</span><span><strong>Location:</strong> {property.Address}, {property.City}</span></div>
                            <div class='step-item'><span class='step-icon'>📅</span><span><strong>Applied on:</strong> {dto.AppliedAt:dd MMM yyyy}</span></div>
                        </div>
                        <div style='text-align:center;'>
                            <a href='{_configuration["Ui:Url"]}dashboard/applications' class='button'>Review Application →</a>
                        </div>
                        <p>Warm regards,<br/><strong>The VeriStay Team</strong></p>
                    </div>
                    <div class='footer'>
                        <p>© {DateTime.UtcNow.Year} VeriStay. All rights reserved.</p>
                        <p><a href='{_configuration["Ui:Url"]}'>Visit VeriStay</a> &nbsp;|&nbsp;
                        <a href='mailto:{_configuration["Email:Support"]}'>Support</a></p>
                    </div>
                </div></div></body></html>";

            await _emailServiceMailJet.SendEmailAsync(
                new EmailMessage(landlord.Email, subject, body));
            return true;
        }

        private async Task<bool> SendApplicationApprovedEmailAsync(
            ApplicationUser student, PropertyDto property, Application entity)
        {
            var subject = $"VeriStay — Application Approved for {property.Title} 🎉";
            var body = $@"
                <html><head><style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
                    .wrapper {{ background-color: #f4f4f4; padding: 40px 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
                    .header {{ background-color: #065f46; padding: 30px 40px; text-align: center; }}
                    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }}
                    .header span {{ color: #6ee7b7; }}
                    .body {{ padding: 40px; }}
                    .highlight-box {{ background-color: #d1fae5; border-left: 4px solid #059669; border-radius: 4px; padding: 16px 20px; margin: 24px 0; font-size: 14px; color: #065f46; }}
                    .property-box {{ background-color: #f8f9fa; border: 1px dashed #ccc; border-radius: 6px; padding: 16px 20px; margin: 20px 0; font-size: 14px; }}
                    .step-item {{ display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 14px; }}
                    .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                    .button {{ display: inline-block; padding: 14px 32px; background-color: #059669; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin: 8px 0 24px 0; }}
                    .footer {{ background-color: #f9f9f9; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }}
                </style></head>
                <body><div class='wrapper'><div class='container'>
                    <div class='header'><h1>Veri<span>Stay</span></h1></div>
                    <div class='body'>
                        <h2>🎉 Congratulations! Application Approved</h2>
                        <p>Dear <strong>{student.FullName}</strong>,</p>
                        <p>Great news! Your application has been <strong>approved</strong> by the landlord.</p>
                        <div class='highlight-box'>
                            ✅ <strong>Next step:</strong> Log in to your VeriStay dashboard to 
                            <strong>accept or decline</strong> this offer. Please respond promptly 
                            as the landlord is waiting.
                        </div>
                        <div class='property-box'>
                            <div class='step-item'><span class='step-icon'>🏠</span><span><strong>Property:</strong> {property.Title}</span></div>
                            <div class='step-item'><span class='step-icon'>📍</span><span><strong>Location:</strong> {property.Address}, {property.City}</span></div>
                            <div class='step-item'><span class='step-icon'>💰</span><span><strong>Monthly Rent:</strong> R {property.MonthlyRent:N0}</span></div>
                        </div>
                        <div style='text-align:center;'>
                            <a href='{_configuration["Ui:Url"]}dashboard/applications' class='button'>Accept or Decline Offer →</a>
                        </div>
                        <p>Warm regards,<br/><strong>The VeriStay Team</strong></p>
                    </div>
                    <div class='footer'><p>© {DateTime.UtcNow.Year} VeriStay. All rights reserved.</p></div>
                </div></div></body></html>";

            await _emailServiceMailJet.SendEmailAsync(
                new EmailMessage(student.Email, subject, body));
            return true;
        }

        private async Task<bool> SendApplicationRejectedEmailAsync(
            ApplicationUser student, PropertyDto property, Application entity)
        {
            var subject = $"VeriStay — Application Update for {property.Title}";
            var body = $@"
                <html><head><style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
                    .wrapper {{ background-color: #f4f4f4; padding: 40px 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
                    .header {{ background-color: #1a1a2e; padding: 30px 40px; text-align: center; }}
                    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; }} .header span {{ color: #4f8ef7; }}
                    .body {{ padding: 40px; }}
                    .highlight-box {{ background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px; padding: 16px 20px; margin: 24px 0; font-size: 14px; color: #991b1b; }}
                    .button {{ display: inline-block; padding: 14px 32px; background-color: #4f8ef7; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px; margin: 8px 0 24px 0; }}
                    .footer {{ background-color: #f9f9f9; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }}
                </style></head>
                <body><div class='wrapper'><div class='container'>
                    <div class='header'><h1>Veri<span>Stay</span></h1></div>
                    <div class='body'>
                        <h2>Application Update</h2>
                        <p>Dear <strong>{student.FullName}</strong>,</p>
                        <p>Thank you for your interest in <strong>{property.Title}</strong>.</p>
                        <div class='highlight-box'>
                            Unfortunately, the landlord has decided not to proceed with your 
                            application at this time. Don't be discouraged — there are many 
                            more properties available on VeriStay!
                        </div>
                        <div style='text-align:center;'>
                            <a href='{_configuration["Ui:Url"]}listings' class='button'>Browse More Properties →</a>
                        </div>
                        <p>Warm regards,<br/><strong>The VeriStay Team</strong></p>
                    </div>
                    <div class='footer'><p>© {DateTime.UtcNow.Year} VeriStay. All rights reserved.</p></div>
                </div></div></body></html>";

            await _emailServiceMailJet.SendEmailAsync(
                new EmailMessage(student.Email, subject, body));
            return true;
        }
    }
}