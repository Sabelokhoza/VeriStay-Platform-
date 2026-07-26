using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static ko.core.Exceptions.ApiException;
namespace ko.core.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IAppLogger<AuthService> _logger;
        private readonly IEmailService _emailService;
        private readonly IFileUploadService _fileUploadService;
        //private readonly IUserService _userService;
        private readonly IMapper _mapper;
        //private readonly ICentreAdminService _centreAdminService;
        //private readonly ICentreStudentService _centreStudentService;
        //private readonly ITrainingCentreService _trainingCentreService;
        private readonly JwtSettings _jwtSettings;
        private readonly IConfiguration _configuration;
        private readonly IEmailServiceMailJet _emailServiceMailJet;
        private readonly AppDbContext _appDbContext;

        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IAppLogger<AuthService> logger, IMapper mapper, AppDbContext appDbContext, IOptions<JwtSettings> jwtSettings, IConfiguration configuration, IEmailService emailService, IFileUploadService fileUploadService, IEmailServiceMailJet emailServiceMailJet)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _mapper = mapper;
            //_centreAdminService = centreAdminService;
            //_jwtSettings = jwtSettings.Value;
            //_userService = userService;
            //_centreStudentService = centreStudentService;
            _appDbContext = appDbContext;
            _jwtSettings = jwtSettings.Value;
            _configuration = configuration;
            _emailService = emailService;
            _fileUploadService = fileUploadService;
            _emailServiceMailJet = emailServiceMailJet;
            //_trainingCentreService = trainingCentreService;
        }

        //public async Task<AuthResponse> RefreshUserToken(string email)
        //{
        //    var user = await _userManager.FindByEmailAsync(email);

        //    var jwtSecurityToken = await GenerateToken(user);
        //    var response = new AuthResponse()
        //    {
        //        Email = user.Email,
        //        Token = jwtSecurityToken,
        //        Id = user.Id,
        //        UserName = user.UserName
        //    };
        //    return response;
        //}

        public async Task<bool> ForgotPassword(RequestForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                throw new BadRequestException("Invalid payload");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            if (string.IsNullOrEmpty(token))
            {
                throw new BadRequestException("Something went wrong");
            }

            var encodedToken = System.Web.HttpUtility.UrlEncode(token);
            var encodedEmail = System.Web.HttpUtility.UrlEncode(user.Email);
            var callbackUrl = $"{_configuration["Ui:Url"]}reset-password?code={encodedToken}&email={encodedEmail}";

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
                        .body {{ padding: 40px; }}
                        .body h2 {{ color: #1a1a2e; margin-top: 0; }}
                        .button {{ 
                            display: inline-block; 
                            padding: 14px 32px; 
                            background-color: #4f8ef7; 
                            color: #ffffff !important; 
                            text-decoration: none; 
                            border-radius: 6px; 
                            font-weight: bold;
                            font-size: 15px;
                            margin: 24px 0;
                        }}
                        .link-box {{ 
                            background-color: #f4f4f4; 
                            border-radius: 4px; 
                            padding: 12px 16px; 
                            font-size: 13px; 
                            word-break: break-all; 
                            color: #555;
                            margin: 12px 0;
                        }}
                        .divider {{ border: none; border-top: 1px solid #eeeeee; margin: 30px 0; }}
                        .notice {{
                            background-color: #fff8e1;
                            border-left: 4px solid #f9a825;
                            padding: 12px 16px;
                            border-radius: 4px;
                            font-size: 13px;
                            color: #555;
                            margin: 20px 0;
                        }}
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
                            </div>

                            <!-- Body -->
                            <div class='body'>
                                <h2>Password Reset Request</h2>
                                <p>Hello {user.FullName},</p>
                                <p>We received a request to reset the password for your <strong>VeriStay</strong> account associated with <strong>{user.Email}</strong>.</p>
                                <p>Click the button below to reset your password:</p>

                                <div style='text-align: center;'>
                                    <a href='{callbackUrl}' class='button'>Reset My Password</a>
                                </div>

                                <p style='font-size: 13px; color: #666;'>Or copy and paste this link into your browser:</p>
                                <div class='link-box'>{callbackUrl}</div>

                                <hr class='divider' />

                                <div class='notice'>
                                    ⚠️ This link will expire in <strong>24 hours</strong> for security reasons. 
                                    If you did not request a password reset, please ignore this email or 
                                    <a href='mailto:{_configuration["Email:Support"]}' style='color: #4f8ef7;'>contact our support team</a> 
                                    if you have concerns.
                                </div>

                                <p style='font-size: 13px; color: #666;'>
                                    For your security, VeriStay will never ask for your password via email or phone.
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
                            </div>

                        </div>
                    </div>
                </body>
                </html>";

            var emailSend = new EmailMessage(user.Email, "VeriStay - Reset Your Password", body);
            await _emailServiceMailJet.SendEmailAsync(emailSend);
               

            return true;

        }

        public async Task<bool> ResetPassword(ResetPasswordRequestDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                throw new BadRequestException("Invalid payload");

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            if (!result.Succeeded)
                throw new BadRequestException("Something went wrong");

            return true;
        }

        public async Task<AuthResponse> Login(LoginDto loginDto)
        {

            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                _logger.LogInformation("User with id {email} is not found", loginDto.Email);
                throw new BadRequestException($"Invalid Email or Password");
            }

            //if (user.EmailConfirmed == false)
            //{
            //    throw new BadRequestException($"Please confirm your email");
            //}

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                throw new BadRequestException($"Invalid Email or Password");
            }

            var jwtSecurityToken = await GenerateToken(user);
            var response = new AuthResponse()
            {
                Email = user.Email,
                Token = jwtSecurityToken,
                Id = user.Id,
                UserName = user.UserName
            };

            return response;
        }


        //public async Task<UpdateProfileDto> UpdateProfile(UpdateProfileDto updateProfileDto)
        //{
        //    _logger.LogInformation("Updating profile for user ID: {UserId}", updateProfileDto.Id);

        //    var user = await GetIdentityUser(updateProfileDto.Id);


        //    if (updateProfileDto.isSouthAfrican)
        //    {
        //        var isValidIdNumber = await _userService.ValidateIdNumber(updateProfileDto.IdNumber);

        //        if (!isValidIdNumber.IsValid)
        //        {
        //            throw new BadRequestException(isValidIdNumber.ErrorMessage, new string[] { isValidIdNumber.ErrorMessage });
        //        }

        //        updateProfileDto.DateOfBirth = isValidIdNumber.Info.BirthDate.ToString("yyyy/MM/dd");

        //        if (updateProfileDto.DateOfBirth != user.DateOfBirth)
        //        {
        //            if (!await CheckIfPersonIs16orOlder(updateProfileDto.DateOfBirth))
        //            {
        //                throw new BadRequestException("Individual must be 16 years or older", new string[] { "Individual must be 16 years or older" });
        //            }
        //        }
        //    }

        //    if (updateProfileDto.Email != user.Email && await CheckIfEmailExists(updateProfileDto.Email))
        //    {
        //        throw new BadRequestException("An existing account is using {0} , email address . Please  try with another email address", new string[] { "Duplicate email , Please Login" });
        //    }

        //    if (updateProfileDto.IdNumber != user.IdNumber && await CheckIfIdNumberIsUsed(updateProfileDto.IdNumber))
        //    {
        //        throw new BadRequestException("An existing account is using {0} , id number is found . Please  try with another email address", new string[] { "Duplicate ID/Passport number , Please Login" });
        //    }

        //    user.IdNumber = updateProfileDto.IdNumber;
        //    user.FirstName = updateProfileDto.FirstName;
        //    user.LastName = updateProfileDto.LastName;
        //    user.UserName = updateProfileDto.Email;
        //    user.Email = updateProfileDto.Email;
        //    user.Address = updateProfileDto.Address;
        //    user.PhoneNumber = updateProfileDto.PhoneNumber;

        //    _logger.LogInformation("Attempting to update user via UserManager for ID {UserId}.", user.Id);

        //    var result = await _userManager.UpdateAsync(user);

        //    if (result.Succeeded)
        //    {
        //        _logger.LogInformation("User with ID {UserId} updated successfully.", user.Id);
        //        return updateProfileDto;
        //    }
        //    else
        //    {
        //        StringBuilder str = new StringBuilder();
        //        foreach (var error in result.Errors)
        //        {
        //            _logger.LogError("Error updating user {UserId}: {Error}", user.Id, error.Description);
        //            str.AppendFormat("{0}\n", error.Description);
        //        }

        //        throw new BadRequestException($"{str}");
        //    }
        //}

        public async Task<RegistrationResponse> RegisterLandLordAsync(IFormFile identificationDocument, RegisterLandlordDto registerDto)
        {


            if (await CheckIfEmailExists(registerDto.Email))
            {
                throw new BadRequestException("An existing account is using {0} , email address . Please  try with another email address", new string[] { "Duplicate email , Please Login" });
            }

            var user = _mapper.Map<ApplicationUser>(registerDto);
            user.UserName = registerDto.Email;
            user.EmailConfirmed = true;
            user.IsActive = true;
            user.IdentificationDocument = await _fileUploadService.UploadFileAsync(identificationDocument, "uploads", "IdentificationDocuments");

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Admin");


                try
                {
                    if (await SendLandlordReviewEmailAsync(user))
                    {
                        return new RegistrationResponse() { UserId = user.Id };
                    }
                }
                catch (Exception)
                {

                    throw new BadRequestException("Failed to send welcome email to user with email :" + user.Email);
                }

                throw new BadRequestException("Failed to send welcome email to user with email :" + user.Email);
            }
            else
            {
                var errors = result.Errors.Select(s => s.Description).ToArray();


                throw new BadRequestException("failed to regiser", errors);
            }
        }


        public async Task<RegistrationResponse> RegisterStudentAsync(IFormFile proofOfIncome, IFormFile proofOfRegistration, RegisterStudentDto registerDto)
        {

            if (await CheckIfEmailExists(registerDto.Email))
            {
                throw new BadRequestException("An existing account is using {0} , email address . Please  try with another email address", new string[] { "Duplicate email , Please Login" });
            }

            if (await CheckIfIdNumberIsUsed(registerDto.StudentNumber))
            {
                throw new BadRequestException("An existing account is using {0} , student number is found . Please  login", new string[] { "Duplicate Student Number , Please Login" });
            }

            var user = _mapper.Map<ApplicationUser>(registerDto);
            user.UserName = registerDto.Email;
            user.EmailConfirmed = true;
            user.IsActive = false;
            user.ProofOfIncomeUrl = await _fileUploadService.UploadFileAsync(proofOfIncome, "uploads", "ProofOfIncome");
            user.ProofOfRegistrationUrl = await _fileUploadService.UploadFileAsync(proofOfIncome, "uploads", "ProofOfRegistration");


            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Student");


                try
                {
                    if (await SendWelcomeEmailAsync(user))
                    {
                        return new RegistrationResponse() { UserId = user.Id };
                    }
                }
                catch (Exception)
                {

                    throw new BadRequestException("Failed to send welcome email to user with email :" + user.Email);
                }

                throw new BadRequestException("Failed to send welcome email to user with email :" + user.Email);
            }
            else
            {
                var errors = result.Errors.Select(s => s.Description).ToArray();


                throw new BadRequestException("failed to regiser", errors);
            }
        }




        private async Task<bool> CheckIfIdNumberIsUsed(string studentNo)
        {
            var user = await _appDbContext.Students.FirstOrDefaultAsync(w => w.StudentNumber == studentNo);
            return user != null;
        }

        #region HelperMethods
        private async Task<ApplicationUser> GetIdentityUser(string id, bool noTrack = false)
        {
            _logger.LogInformation("Retrieving identity user by ID: {UserId}", id);

            ApplicationUser user = null;
            if (noTrack)
            {
                user = await _appDbContext.Users.AsNoTracking().FirstOrDefaultAsync(w => w.Id == id);
            }
            else
            {
                user = await _appDbContext.Users.FirstOrDefaultAsync(w => w.Id == id);
            }


            if (user == null)
                _logger.LogWarning("No identity user found with ID: {UserId}", id);
            else
                _logger.LogInformation("Identity user with ID: {UserId} retrieved.", id);

            return user;
        }


        private async Task<bool> SendLandlordReviewEmailAsync(ApplicationUser user)
        {
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
                            background-color: #fff8e1;
                            border-left: 4px solid #f9a825;
                            border-radius: 4px;
                            padding: 16px 20px;
                            margin: 24px 0;
                            font-size: 14px;
                            color: #444;
                        }}
                        .steps {{ margin: 24px 0; }}
                        .step-item {{ display: flex; align-items: flex-start; margin-bottom: 16px; font-size: 14px; }}
                        .step-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
                        .status-badge {{
                            display: inline-block;
                            background-color: #fff3cd;
                            color: #856404;
                            border: 1px solid #ffc107;
                            border-radius: 20px;
                            padding: 4px 14px;
                            font-size: 13px;
                            font-weight: bold;
                            margin: 8px 0 20px 0;
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
                        .divider {{ border: none; border-top: 1px solid #eeeeee; margin: 30px 0; }}
                        .notice {{
                            background-color: #f0f5ff;
                            border-left: 4px solid #4f8ef7;
                            border-radius: 4px;
                            padding: 12px 16px;
                            font-size: 13px;
                            color: #555;
                            margin: 20px 0;
                        }}
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
                                <h2>Application Received! 📋</h2>
                                <p>Dear <strong>{user.FullName}</strong>,</p>
                                <p>
                                    Thank you for registering as a landlord on <strong>VeriStay</strong>. 
                                    We have successfully received your application and it is currently 
                                    under review by our administration team.
                                </p>

                                <div style='text-align: center;'>
                                    <span class='status-badge'>⏳ Application Under Review</span>
                                </div>

                                <div class='highlight-box'>
                                    ⚠️ <strong>Please note:</strong> Your account is currently <strong>pending approval</strong>. 
                                    You will not be able to list properties or access landlord features until 
                                    a VeriStay administrator has reviewed and approved your application.
                                </div>

                                <p><strong>What happens next?</strong></p>

                                <div class='steps'>
                                    <div class='step-item'>
                                        <span class='step-icon'>🔍</span>
                                        <span>A <strong>VeriStay administrator</strong> will review your submitted documents and landlord information.</span>
                                    </div>
                                    <div class='step-item'>
                                        <span class='step-icon'>📬</span>
                                        <span>You will receive an <strong>email notification</strong> once a decision has been made on your application.</span>
                                    </div>
                                    <div class='step-item'>
                                        <span class='step-icon'>✅</span>
                                        <span>If <strong>approved</strong>, you will gain full access to list properties and manage tenant applications.</span>
                                    </div>
                                    <div class='step-item'>
                                        <span class='step-icon'>❌</span>
                                        <span>If <strong>rejected</strong>, you will receive feedback explaining the reason, and you may reapply with updated documentation.</span>
                                    </div>
                                    <div class='step-item'>
                                        <span class='step-icon'>⏱️</span>
                                        <span>Reviews are typically completed within <strong>2 – 3 business days</strong>.</span>
                                    </div>
                                </div>

                                <div class='notice'>
                                    💡 While you wait, you can log in to your account to review or update 
                                    your submitted documents via your landlord dashboard.
                                </div>

                                <div style='text-align: center;'>
                                    <a href='{_configuration["Ui:Url"]}dashboard' class='button'>Go to My Dashboard →</a>
                                </div>

                                <hr class='divider' />

                                <p style='font-size: 13px; color: #666;'>
                                    If you have any questions about your application or need assistance, 
                                    please don't hesitate to contact our support team at 
                                    <a href='mailto:{_configuration["Email:Support"]}' style='color: #4f8ef7;'>{_configuration["Email:Support"]}</a>.
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

            var emailSend = new EmailMessage(user.Email, "VeriStay — Your Landlord Application is Under Review 📋", body);
            await _emailServiceMailJet.SendEmailAsync(emailSend);
            return true;
        }



        private async Task<bool> SendWelcomeEmailAsync(ApplicationUser user)
        {
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
                .features {{ margin: 24px 0; }}
                .feature-item {{ display: flex; align-items: flex-start; margin-bottom: 16px; font-size: 14px; }}
                .feature-icon {{ font-size: 18px; margin-right: 12px; min-width: 24px; }}
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
                        <h2>Welcome to VeriStay! 🎉</h2>
                        <p>Dear <strong>{user.FullName}</strong>,</p>
                        <p>
                            We're excited to have you on board! Your VeriStay account has been successfully created 
                            and you're now part of a platform built to make student accommodation safe, verified, and stress-free.
                        </p>

                        <div class='highlight-box'>
                            🏠 <strong>Your account is ready.</strong> You can now browse verified properties, 
                            submit applications, and manage your accommodation — all in one place.
                        </div>

                        <p><strong>Here's what you can do with VeriStay:</strong></p>

                        <div class='features'>
                            <div class='feature-item'>
                                <span class='feature-icon'>✅</span>
                                <span>Browse <strong>verified listings</strong> from approved landlords only</span>
                            </div>
                            <div class='feature-item'>
                                <span class='feature-icon'>📋</span>
                                <span>Submit and track your <strong>accommodation applications</strong> in real time</span>
                            </div>
                            <div class='feature-item'>
                                <span class='feature-icon'>💳</span>
                                <span>Manage your <strong>rent payments</strong> and view receipts securely</span>
                            </div>
                            <div class='feature-item'>
                                <span class='feature-icon'>🔧</span>
                                <span>Log and track <strong>maintenance requests</strong> directly with your landlord</span>
                            </div>
                            <div class='feature-item'>
                                <span class='feature-icon'>📄</span>
                                <span>Access your <strong>lease documents</strong> anytime, anywhere</span>
                            </div>
                        </div>

                        <div style='text-align: center;'>
                            <a href='{_configuration["Ui:Url"]}' class='button'>Get Started →</a>
                        </div>

                        <hr class='divider' />

                        <p style='font-size: 13px; color: #666;'>
                            If you have any questions or need assistance getting started, our support team is always 
                            happy to help. Reach us at 
                            <a href='mailto:{_configuration["Email:Support"]}' style='color: #4f8ef7;'>{_configuration["Email:Support"]}</a>.
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
                            You received this email because you created an account on VeriStay.<br/>
                            If this wasn't you, please contact us immediately.
                        </p>
                    </div>

                </div>
            </div>
        </body>
        </html>";

            var emailSend = new EmailMessage(user.Email, "Welcome to VeriStay — You're all set! 🏠", body);
            await _emailServiceMailJet.SendEmailAsync(emailSend);

            return true;
        }

        private async Task<string> GenerateToken(ApplicationUser user)
        {
            var userClaims = (await _userManager.GetClaimsAsync(user)).ToList();
            var roles = (await _userManager.GetRolesAsync(user)).ToList();

            var claims = new List<Claim>()
            {
                new ("uid" , user.Id),
                new ("name" , user.UserName),
                new (ClaimTypes.Email , user.Email)
            };



            claims.AddRange(roles.Select(s => new Claim(ClaimTypes.Role, s)));
            claims.AddRange(userClaims);

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }
        private async Task<bool> CheckIfEmailExists(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user != null;
        }
        #endregion
    }
}
