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
            IFileUploadService fileUploadService)
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
        }

        #region CRUD

        public async Task<ApplicationDto?> AddAsync(string studentId, AddApplicationDto dto)
        {
            var canAdd = await onInsert(dto);
            if (!canAdd) return null;

            _logger.LogInformation("Adding application for student {0} to the database", studentId);

            var entity = _mapper.Map<Application>(dto);
            entity.StudentId = studentId;
            entity.Status = ApplicationStatus.Pending;
            entity.DateCreated = DateTime.UtcNow;


            //to do fix
            var user = await _userManager.FindByIdAsync(studentId);

            await _appDbContext.Applications.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();

            var result = _mapper.Map<ApplicationDto>(entity);
            _logger.LogInformation("Application with id {0} has been added successfully", result.Id);

            await afterInsert(result);
            return result;
        }

        public async Task<List<ApplicationDto>> GetAllAsync()
        {
            _logger.LogInformation("Retrieving all applications from the database");

            var data = await _appDbContext.Applications
                
                .ToListAsync();

            return _mapper.Map<List<ApplicationDto>>(data);
        }

       

        public async Task<ApplicationDto?> GetByIdAsync(int? id)
        {
            _logger.LogInformation("Attempting to retrieve application with id {0}", id);

            var entity = await _appDbContext.Applications
                .Include(a => a.Student)
                .Include(a => a.Property)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (entity == null)
            {
                _logger.LogInformation("Application with id {0} was not found", id);
                throw new NotFoundException(nameof(GetByIdAsync), id);
            }

            return _mapper.Map<ApplicationDto>(entity);
        }

        public async Task<StudentApplication?> ViewStudentApplicationByIdAsync(int applicationId)
        {
            _logger.LogInformation("Attempting to retrieve application with id {0}", applicationId);

            var entity = await _appDbContext.Applications
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            var propery = await _propertyService.GetByIdAsync(entity.PropertyId);

            var studentApplication = _mapper.Map<StudentApplication>(entity);
            var user = await _userManager.FindByIdAsync(entity.StudentId);

            studentApplication.StudentName = user.FullName;
            studentApplication.Price = propery.MonthlyRent;
            studentApplication.PropertyDescription = propery.Description;
            studentApplication.PropertyTitle = propery.Title;
            studentApplication.PropertyLocation = propery.Address + " - " + propery.City;


            studentApplication.ProofOfIncomeUrl = await _fileUploadService.GetSignedUrlAsync("uploads", user.ProofOfIncomeUrl);
            studentApplication.ProofOfRegistrationUrl = await _fileUploadService.GetSignedUrlAsync("uploads", user.ProofOfRegistrationUrl);


            return studentApplication;
        }

        public async Task<List<ApplicationDto>> GetByStudentIdAsync(string studentId)
        {
            _logger.LogInformation("Retrieving applications for student {0}", studentId);

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
            _logger.LogInformation("Retrieving applications for landlord {0}", landlordId);

            var properties = await _propertyService.GetByLandlordIdAsync(landlordId);

            if (properties == null || properties.Count <= 0)
                return new List<ApplicationDto>();

            var data = await _appDbContext.Applications
                .Where(a => properties.Select(s => s.Id).Contains(a.PropertyId))
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
            _logger.LogInformation("Retrieving applications for property {0}", propertyId);

            var data = await _appDbContext.Applications
                .Include(a => a.Student)
                .Where(a => a.PropertyId == propertyId)
                .ToListAsync();



            return _mapper.Map<List<ApplicationDto>>(data);
        }

        public async Task<bool> DeleteAsync(int? id)
        {
            _logger.LogInformation("Attempting to delete application with id {0}", id);

            var entity = await GetByIdAsync(id);
            var canDelete = await onDelete(entity);
            if (!canDelete) return false;

            await _genericService.RemoveAsync(id);
            _logger.LogInformation("Application with id {0} has been successfully removed", id);

            await afterDelete(entity);
            return true;
        }

        public async Task<bool> ReviewAsync(ReviewApplicationDto dto)
        {
            _logger.LogInformation("Reviewing application with id {0}", dto.ApplicationId);

            var entity = await _appDbContext.Applications.FindAsync(dto.ApplicationId);
            if (entity == null) throw new NotFoundException(nameof(ReviewAsync), dto.ApplicationId);

            var mapped = _mapper.Map<ApplicationDto>(entity);
            var canUpdate = await onUpdate(mapped);
            if (!canUpdate) return false;

            entity.Status = dto.Status;
            //entity.ReviewNotes = dto.ReviewNotes;
            //entity.DateReviewed = DateTime.UtcNow;

            await _appDbContext.SaveChangesAsync();

            _logger.LogInformation("Application with id {0} has been reviewed with status {1}", dto.ApplicationId, dto.Status);
            await afterUpdate(_mapper.Map<ApplicationDto>(entity));
            return true;
        }

        #endregion

        #region Events

        public async Task<bool> onInsert(AddApplicationDto dto) {
            await CheckDuplicateApplication(dto);
            return true;
        }

        private async Task CheckDuplicateApplication(AddApplicationDto dto)
        {

            if (await _appDbContext.Applications.AnyAsync(w => w.PropertyId == dto.PropertyId && w.StudentId == dto.studentId))
            {
                throw new BadRequestException("Application Already exist for this propery , contact landlord for updates");
            }
        }

        public async Task<bool> afterInsert(ApplicationDto dto)
        {
            var student = await _userManager.FindByIdAsync(dto.StudentId);
            var property = await _propertyService.GetByIdAsync(dto.PropertyId);
            var landlord = await _userManager.FindByIdAsync(property.LandlordId);

            if (student != null && property != null)
                await SendApplicationSubmittedEmailAsync(student, property, dto);

            if (landlord != null && student != null && property != null)
                await SendNewApplicationEmailAsync(landlord, student, property, dto);

            return true;
        }


        public async Task<bool> AcceptDeclineOffer(int applicationId , bool isAcccepted)
        {
            var entity = await _appDbContext.Applications.FindAsync(applicationId);
            if (entity == null) throw new NotFoundException(nameof(AcceptDeclineOffer), applicationId);

            if (isAcccepted)
            {
                var mapped = _mapper.Map<ApplicationDto>(entity);
                var canUpdate = await onUpdate(mapped);
                if (!canUpdate) return false;

                entity.Status = ApplicationStatus.Accepted;
                var propery = await _propertyService.GetByIdAsync(entity.PropertyId);

                await _appDbContext.SaveChangesAsync();
                await _tenancyService.AddAsync(new AddTenancyDto
                {
                    StudentId = entity.StudentId,
                    LeaseEndDate = DateTime.UtcNow.AddDays(30),
                    LeaseStartDate = DateTime.UtcNow,
                    PropertyId =  entity.PropertyId,
                    MonthlyRent = propery.MonthlyRent
                });


            }
            else
            {
                var mapped = _mapper.Map<ApplicationDto>(entity);
                var canUpdate = await onUpdate(mapped);
                if (!canUpdate) return false;

                entity.Status = ApplicationStatus.Declined;
                await _appDbContext.SaveChangesAsync();
            }

            return true;
        }

        private async Task SendApplicitionApprovedEmailAsync(Application entity)
        {
            var propery = await _propertyService.GetByIdAsync(entity.PropertyId);
            var student = await _userManager.FindByIdAsync(entity.StudentId);
            var ladlord = await _userManager.FindByIdAsync(propery.LandlordId);

            
        }

        public Task<bool> onUpdate(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> afterUpdate(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> onDelete(ApplicationDto dto) => Task.FromResult(true);
        public Task<bool> afterDelete(ApplicationDto dto) => Task.FromResult(true);

        #endregion

        #region Helpers
        private async Task<bool> SendApplicationSubmittedEmailAsync(ApplicationUser student, PropertyDto property, ApplicationDto dto)
        {
            var subject = $"VeriStay — Application Submitted for {property.Title} 📩";

            var body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
                        .wrapper {{ background-color: #f4f4f4; padding: 40px 20px; }}
                        .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
                        .header {{ background-color: #1a1a2e; padding: 30px 40px; text-align: center; }}
                        .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }}
                        .header span {{ color: #4f8ef7; }}
                        .header p {{ color: #aab4c8; font-size: 13px; margin: 8px 0 0 0; }}
                        .body {{ padding: 40px; }}
                        .body h2 {{ color: #1a1a2e; margin-top: 0; }}
                        .highlight-box {{
                            background-color: #f0f5ff;
                            border-left: 4px solid #4f8ef7;
                            border-radius: 4px;
                            padding: 16px 20px;
                            margin: 24px 0;
                            font-size: 14px;
                            color: #444;
                        }}
                        .status-badge {{
                            display: inline-block;
                            background-color: #dbeafe;
                            color: #1e40af;
                            border: 1px solid #4f8ef7;
                            border-radius: 20px;
                            padding: 4px 14px;
                            font-size: 13px;
                            font-weight: bold;
                            margin: 8px 0 20px 0;
                        }}
                        .property-box {{
                            background-color: #f8f9fa;
                            border: 1px dashed #ccc;
                            border-radius: 6px;
                            padding: 16px 20px;
                            margin: 20px 0;
                            font-size: 14px;
                            color: #444;
                        }}
                        .steps {{ margin: 24px 0; }}
                        .step-item {{ display: flex; align-items: flex-start; margin-bottom: 16px; font-size: 14px; }}
                        .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                        .button {{ 
                            display: inline-block; 
                            padding: 14px 32px; 
                            background-color: #4f8ef7; 
                            color: #ffffff !important; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            font-weight: bold;
                            font-size: 15px;
                            margin: 8px 0 24px 0;
                        }}
                        .divider {{ border: none; border-top: 1px solid #eeeeee; margin: 30px 0; }}
                        .footer {{ background-color: #f9f9f9; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }}
                        .footer a {{ color: #4f8ef7; text-decoration: none; }}
                    </style>
                </head>
                <body>
                    <div class='wrapper'>
                        <div class='container'>

                            <!-- Header -->
                            <div class='header'>
                                <h1>Veri<span>Stay</span></h1>
                                <p>Verified Student Accommodation Platform</p>
                            </div>

                            <!-- Body -->
                            <div class='body'>
                                <h2>Application Submitted! 📩</h2>
                                <p>Dear <strong>{student.FullName}</strong>,</p>
                                <p>
                                    Your application for a property on <strong>VeriStay</strong> has been 
                                    successfully submitted. The landlord has been notified and will review 
                                    your application shortly.
                                </p>

                                <div style='text-align: center;'>
                                    <span class='status-badge'>📩 Application Pending Review</span>
                                </div>

                                <div class='highlight-box'>
                                    ⏳ <strong>What happens now?</strong> The landlord will review your application 
                                    and supporting documents. You'll receive an email as soon as a decision has 
                                    been made — no action is needed from you right now.
                                </div>

                                <p><strong>Application details:</strong></p>

                                <div class='property-box'>
                                    <div class='step-item'>
                                        <span class='step-icon'>🏠</span>
                                        <span><strong>Property:</strong> {property.Title}</span>
                                    </div>
                                    <div class='step-item'>
                                        <span class='step-icon'>📍</span>
                                        <span><strong>Location:</strong> {property.Address}, {property.City}</span>
                                    </div>
                                    <div class='step-item'>
                                        <span class='step-icon'>💰</span>
                                        <span><strong>Monthly Rent:</strong> R {property.MonthlyRent:N0}</span>
                                    </div>
                                    <div class='step-item'>
                                        <span class='step-icon'>📅</span>
                                        <span><strong>Applied on:</strong> {dto.AppliedAt:dd MMM yyyy}</span>
                                    </div>
                                </div>

                                <div style='text-align: center;'>
                                    <a href='{_configuration["Ui:Url"]}dashboard/applications' class='button'>Track Your Application →</a>
                                </div>

                                <hr class='divider' />

                                <p style='font-size: 13px; color: #666;'>
                                    If you have any questions, our support team is always happy to help. 
                                    Reach us at <a href='mailto:{_configuration["Email:Support"]}' style='color: #4f8ef7;'>
                                    {_configuration["Email:Support"]}</a>.
                                </p>

                                <p>
                                    Warm regards,<br/>
                                    <strong>The VeriStay Team</strong>
                                </p>
                            </div>

                            <!-- Footer -->
                            <div class='footer'>
                                <p>© {DateTime.UtcNow.Year} VeriStay. All rights reserved.</p>
                                <p>Verified Student Accommodation Platform</p>
                                <p>
                                    <a href='{_configuration["Ui:Url"]}'>Visit VeriStay</a> &nbsp;|&nbsp;
                                    <a href='mailto:{_configuration["Email:Support"]}'>Support</a>
                                </p>
                                <p style='margin-top: 12px; font-size: 11px; color: #bbb;'>
                                    You received this email because you submitted a rental application on VeriStay.<br/>
                                    If this wasn't you, please contact us immediately.
                                </p>
                            </div>

                        </div>
                    </div>
                </body>
                </html>";

            var emailSend = new EmailMessage(student.Email, subject, body);
            await _emailServiceMailJet.SendEmailAsync(emailSend);

            return true;
        }

        private async Task<bool> SendNewApplicationEmailAsync(ApplicationUser landlord, ApplicationUser student, PropertyDto property, ApplicationDto dto)
        {
            var subject = $"VeriStay — New Application for {property.Title} 🔔";

            var body = $@"
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
                    .wrapper {{ background-color: #f4f4f4; padding: 40px 20px; }}
                    .container {{ max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }}
                    .header {{ background-color: #1a1a2e; padding: 30px 40px; text-align: center; }}
                    .header h1 {{ color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }}
                    .header span {{ color: #4f8ef7; }}
                    .header p {{ color: #aab4c8; font-size: 13px; margin: 8px 0 0 0; }}
                    .body {{ padding: 40px; }}
                    .body h2 {{ color: #1a1a2e; margin-top: 0; }}
                    .highlight-box {{
                        background-color: #fffaf0;
                        border-left: 4px solid #f5a623;
                        border-radius: 4px;
                        padding: 16px 20px;
                        margin: 24px 0;
                        font-size: 14px;
                        color: #444;
                    }}
                    .status-badge {{
                        display: inline-block;
                        background-color: #fef3c7;
                        color: #92400e;
                        border: 1px solid #f5a623;
                        border-radius: 20px;
                        padding: 4px 14px;
                        font-size: 13px;
                        font-weight: bold;
                        margin: 8px 0 20px 0;
                    }}
                    .applicant-box {{
                        background-color: #f8f9fa;
                        border: 1px dashed #ccc;
                        border-radius: 6px;
                        padding: 16px 20px;
                        margin: 20px 0;
                        font-size: 14px;
                        color: #444;
                    }}
                    .steps {{ margin: 24px 0; }}
                    .step-item {{ display: flex; align-items: flex-start; margin-bottom: 16px; font-size: 14px; }}
                    .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                    .button {{ 
                        display: inline-block; 
                        padding: 14px 32px; 
                        background-color: #4f8ef7; 
                        color: #ffffff !important; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        font-size: 15px;
                        margin: 8px 0 24px 0;
                    }}
                    .divider {{ border: none; border-top: 1px solid #eeeeee; margin: 30px 0; }}
                    .footer {{ background-color: #f9f9f9; padding: 24px 40px; text-align: center; font-size: 12px; color: #999; }}
                    .footer a {{ color: #4f8ef7; text-decoration: none; }}
                </style>
            </head>
            <body>
                <div class='wrapper'>
                    <div class='container'>

                        <!-- Header -->
                        <div class='header'>
                            <h1>Veri<span>Stay</span></h1>
                            <p>Verified Student Accommodation Platform</p>
                        </div>

                        <!-- Body -->
                        <div class='body'>
                            <h2>New Application Received 🔔</h2>
                            <p>Dear <strong>{landlord.FullName}</strong>,</p>
                            <p>
                                You've received a new rental application on <strong>VeriStay</strong> for one 
                                of your listed properties. Please review the applicant's details below and 
                                respond from your dashboard.
                            </p>

                            <div style='text-align: center;'>
                                <span class='status-badge'>🔔 Awaiting Your Review</span>
                            </div>

                            <div class='highlight-box'>
                                ⏳ <strong>Action required.</strong> Please review this application as soon as 
                                possible. Students are notified automatically once you approve or reject 
                                their application.
                            </div>

                            <p><strong>Applicant details:</strong></p>

                            <div class='applicant-box'>
                                <div class='step-item'>
                                    <span class='step-icon'>🎓</span>
                                    <span><strong>Student:</strong> {student.FullName}</span>
                                </div>
                                <div class='step-item'>
                                    <span class='step-icon'>📧</span>
                                    <span><strong>Email:</strong> {student.Email}</span>
                                </div>
                                <div class='step-item'>
                                    <span class='step-icon'>🏠</span>
                                    <span><strong>Property:</strong> {property.Title}</span>
                                </div>
                                <div class='step-item'>
                                    <span class='step-icon'>📍</span>
                                    <span><strong>Location:</strong> {property.Address}, {property.City}</span>
                                </div>
                                <div class='step-item'>
                                    <span class='step-icon'>📅</span>
                                    <span><strong>Applied on:</strong> {dto.AppliedAt:dd MMM yyyy}</span>
                                </div>
                            </div>

                            <div style='text-align: center;'>
                                <a href='{_configuration["Ui:Url"]}dashboard/applications' class='button'>Review Application →</a>
                            </div>

                            <hr class='divider' />

                            <p style='font-size: 13px; color: #666;'>
                                If you have any questions, our support team is always happy to help. 
                                Reach us at <a href='mailto:{_configuration["Email:Support"]}' style='color: #4f8ef7;'>
                                {_configuration["Email:Support"]}</a>.
                            </p>

                            <p>
                                Warm regards,<br/>
                                <strong>The VeriStay Team</strong>
                            </p>
                        </div>

                        <!-- Footer -->
                        <div class='footer'>
                            <p>© {DateTime.UtcNow.Year} VeriStay. All rights reserved.</p>
                            <p>Verified Student Accommodation Platform</p>
                            <p>
                                <a href='{_configuration["Ui:Url"]}'>Visit VeriStay</a> &nbsp;|&nbsp;
                                <a href='mailto:{_configuration["Email:Support"]}'>Support</a>
                            </p>
                            <p style='margin-top: 12px; font-size: 11px; color: #bbb;'>
                                You received this email because you are a registered landlord on VeriStay.<br/>
                                If this wasn't you, please contact us immediately.
                            </p>
                        </div>

                    </div>
                </div>
            </body>
            </html>";

            var emailSend = new EmailMessage(landlord.Email, subject, body);
            await _emailServiceMailJet.SendEmailAsync(emailSend);

            return true;
        }

        #endregion
    }
}   