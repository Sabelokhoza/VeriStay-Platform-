using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAppLogger<UserService> _logger;
        private readonly IMapper _mapper;
        private readonly AppDbContext _appDbContext;
        private readonly IStorageFileService _storageFileService;
        private readonly IServiceProvider _serviceProvider;
        private readonly IEmailService _emailService;
        private readonly IApplicationService _applicationService;
        private readonly IConfiguration _configuration;
        private readonly IEmailServiceMailJet _emailServiceMailJet;


        public UserService(UserManager<ApplicationUser> userManager, IAppLogger<UserService> logger, IMapper mapper, AppDbContext identityDbContext, IServiceProvider serviceProvider, IEmailService emailService, IConfiguration configuration, IApplicationService applicationService, IEmailServiceMailJet emailServiceMailJet)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
            _appDbContext = identityDbContext;
            _serviceProvider = serviceProvider;
            _emailService = emailService;
            _configuration = configuration;
            _applicationService = applicationService;
            _emailServiceMailJet = emailServiceMailJet;
        }


        public async Task<bool> UpdateLandLordStatus(string userId, bool isApproved = false)
        {
            _logger.LogInformation("Updating LandlordStatus for user {0}", userId);

            var landlord = await _userManager.FindByIdAsync(userId);
            if (landlord == null) throw new NotFoundException(nameof(UpdateLandLordStatus), userId);

            landlord.IsActive = isApproved;
            landlord.VerificationStatus = isApproved ? VerificationStatus.Approved : VerificationStatus.Rejected;

            await _userManager.UpdateAsync(landlord);
            await SendStatusUpdateEmailAsync(landlord, isApproved);

            return true;
        }

        public async Task<StudentDashboardDataDto> GetStudentDashboardData(string userId)
        {
            _logger.LogInformation("Student dashboard data for user {0}", userId);

            var studentDashboardDataDto = new StudentDashboardDataDto();
            studentDashboardDataDto.Student = await GetUser(userId);
            studentDashboardDataDto.Applications = await _applicationService.GetByStudentIdAsync(userId);
            studentDashboardDataDto.ApplicationsCount = studentDashboardDataDto.Applications.Count();
            studentDashboardDataDto.ApprovedCount = studentDashboardDataDto.Applications.Count(w => w.Status == ApplicationStatus.Approved);
            studentDashboardDataDto.WaitingList = studentDashboardDataDto.Applications.Where(w => w.Status == ApplicationStatus.WaitingList).ToList();

            return studentDashboardDataDto;
        }



        public async Task<ProfileDto> GetUser(string userId)
        {
            _logger.LogInformation("Fetching user with ID: {UserId}", userId);

            var user = await _appDbContext.Users.Where(w => w.Id == userId)
                .AsNoTracking()
                .ProjectTo<ProfileDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found.", userId);
                throw new NotFoundException("User with ID {UserId} not found.", userId);
            }
            else
            {
                _logger.LogInformation("User with ID {UserId} retrieved successfully.", userId);
            }

            return user;
        }

        private async Task<bool> SendStatusUpdateEmailAsync(ApplicationUser user, bool isApproved)
        {
            var subject = isApproved
                ? "VeriStay — Your Landlord Application has been Approved ✅"
                : "VeriStay — Your Landlord Application was Unsuccessful ❌";

            var approvedBody = $@"
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
                    background-color: #f0fff4;
                    border-left: 4px solid #28a745;
                    border-radius: 4px;
                    padding: 16px 20px;
                    margin: 24px 0;
                    font-size: 14px;
                    color: #444;
                }}
                .status-badge {{
                    display: inline-block;
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #28a745;
                    border-radius: 20px;
                    padding: 4px 14px;
                    font-size: 13px;
                    font-weight: bold;
                    margin: 8px 0 20px 0;
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
                .credentials-box {{
                    background-color: #f8f9fa;
                    border: 1px dashed #ccc;
                    border-radius: 6px;
                    padding: 16px 20px;
                    margin: 20px 0;
                    font-size: 14px;
                    color: #444;
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
                        <h2>You're Approved! 🎉</h2>
                        <p>Dear <strong>{user.FullName}</strong>,</p>
                        <p>
                            Great news! Your landlord application on <strong>VeriStay</strong> has been 
                            reviewed by our administration team and has been <strong>approved</strong>. 
                            You can now start listing your properties and managing tenant applications.
                        </p>

                        <div style='text-align: center;'>
                            <span class='status-badge'>✅ Application Approved</span>
                        </div>

                        <div class='highlight-box'>
                            🏠 <strong>Your landlord account is now active.</strong> You have full access 
                            to list properties, review student applications, track rent payments, and 
                            manage maintenance requests — all from your dashboard.
                        </div>

                        <p><strong>Sign in using your registered credentials:</strong></p>

                        <div class='credentials-box'>
                            <div class='step-item'>
                                <span class='step-icon'>📧</span>
                                <span><strong>Email:</strong> {user.Email}</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>🔑</span>
                                <span><strong>Password:</strong> Use the password you set during registration. 
                                If you've forgotten it, use the 
                                <a href='{_configuration["Ui:Url"]}forgot-password' style='color: #4f8ef7;'>
                                    Reset Password
                                </a> link.</span>
                            </div>
                        </div>

                        <p><strong>Here's what you can do now:</strong></p>

                        <div class='steps'>
                            <div class='step-item'>
                                <span class='step-icon'>🏠</span>
                                <span>Create and publish <strong>property listings</strong> with photos, pricing, and amenities.</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>📋</span>
                                <span>Review and manage <strong>student applications</strong> from your dashboard.</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>💳</span>
                                <span>Track <strong>rent payments</strong> and send reminders to tenants.</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>🔧</span>
                                <span>Receive and resolve <strong>maintenance requests</strong> from tenants.</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>⭐</span>
                                <span>Build your <strong>reputation score</strong> through tenant reviews.</span>
                            </div>
                        </div>

                        <div style='text-align: center;'>
                            <a href='{_configuration["Ui:Url"]}login' class='button'>Sign In to VeriStay →</a>
                        </div>

                        <hr class='divider' />

                        <p style='font-size: 13px; color: #666;'>
                            If you have any questions, our support team is always happy to help. 
                            Reach us at <a href='mailto:{_configuration["Email:Support"]}' style='color: #4f8ef7;'>
                            {_configuration["Email:Support"]}</a>.
                        </p>

                        <p>
                            Warm regards,<br/>
                            <strong>The VeriStay Administration Team</strong>
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
                            You received this email because you registered as a landlord on VeriStay.<br/>
                            If this wasn't you, please contact us immediately.
                        </p>
                    </div>

                </div>
            </div>
        </body>
        </html>";

            var rejectedBody = $@"
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
                    background-color: #fff5f5;
                    border-left: 4px solid #dc3545;
                    border-radius: 4px;
                    padding: 16px 20px;
                    margin: 24px 0;
                    font-size: 14px;
                    color: #444;
                }}
                .status-badge {{
                    display: inline-block;
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #dc3545;
                    border-radius: 20px;
                    padding: 4px 14px;
                    font-size: 13px;
                    font-weight: bold;
                    margin: 8px 0 20px 0;
                }}
                .steps {{ margin: 24px 0; }}
                .step-item {{ display: flex; align-items: flex-start; margin-bottom: 16px; font-size: 14px; }}
                .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                .notice {{
                    background-color: #f0f5ff;
                    border-left: 4px solid #4f8ef7;
                    border-radius: 4px;
                    padding: 12px 16px;
                    font-size: 13px;
                    color: #555;
                    margin: 20px 0;
                }}
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
                .credentials-box {{
                    background-color: #f8f9fa;
                    border: 1px dashed #ccc;
                    border-radius: 6px;
                    padding: 16px 20px;
                    margin: 20px 0;
                    font-size: 14px;
                    color: #444;
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
                        <h2>Application Outcome</h2>
                        <p>Dear <strong>{user.FullName}</strong>,</p>
                        <p>
                            Thank you for your patience while we reviewed your landlord application 
                            on <strong>VeriStay</strong>. After careful consideration, our administration 
                            team was unfortunately unable to approve your application at this time.
                        </p>

                        <div style='text-align: center;'>
                            <span class='status-badge'>❌ Application Unsuccessful</span>
                        </div>

                        <div class='highlight-box'>
                            ⚠️ <strong>Your account has not been activated.</strong> You are currently 
                            unable to list properties or access landlord features on VeriStay. 
                            Please review the steps below to reapply.
                        </div>

                        <p><strong>Common reasons for rejection include:</strong></p>

                        <div class='steps'>
                            <div class='step-item'>
                                <span class='step-icon'>📄</span>
                                <span>Incomplete or unreadable <strong>verification documents</strong>.</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>🏠</span>
                                <span>Property details that do not meet <strong>VeriStay's listing standards</strong>.</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>🔍</span>
                                <span>Information provided could <strong>not be verified</strong> against official records.</span>
                            </div>
                        </div>

                        <div class='notice'>
                            💡 <strong>You can reapply.</strong> Log in to your account using your 
                            registered credentials, update your documentation, and resubmit your 
                            application for review.
                        </div>

                        <p><strong>Sign in using your registered credentials to reapply:</strong></p>

                        <div class='credentials-box'>
                            <div class='step-item'>
                                <span class='step-icon'>📧</span>
                                <span><strong>Email:</strong> {user.Email}</span>
                            </div>
                            <div class='step-item'>
                                <span class='step-icon'>🔑</span>
                                <span><strong>Password:</strong> Use the password you set during registration. 
                                If you've forgotten it, use the 
                                <a href='{_configuration["Ui:Url"]}forgot-password' style='color: #4f8ef7;'>
                                    Reset Password
                                </a> link to regain access.</span>
                            </div>
                        </div>

                        <div style='text-align: center;'>
                            <a href='{_configuration["Ui:Url"]}login' class='button'>Sign In & Reapply →</a>
                        </div>

                        <hr class='divider' />

                        <p style='font-size: 13px; color: #666;'>
                            If you believe this decision was made in error or would like more information 
                            about the reason for rejection, please contact our support team at 
                            <a href='mailto:{_configuration["Email:Support"]}' style='color: #4f8ef7;'>
                            {_configuration["Email:Support"]}</a> and we will be happy to assist you.
                        </p>

                        <p>
                            Warm regards,<br/>
                            <strong>The VeriStay Administration Team</strong>
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
                            You received this email because you registered as a landlord on VeriStay.<br/>
                            If this wasn't you, please contact us immediately.
                        </p>
                    </div>

                </div>
            </div>
        </body>
        </html>";

            var body = isApproved ? approvedBody : rejectedBody;
            var emailSend = new EmailMessage(user.Email, subject, body);

            await _emailServiceMailJet.SendEmailAsync(emailSend);

            return true;
        }
    }
}
