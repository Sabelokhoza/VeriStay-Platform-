using AutoMapper;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        //private readonly IEmailService _emailService;
        //private readonly IUserService _userService;
        private readonly IMapper _mapper;
        //private readonly ICentreAdminService _centreAdminService;
        //private readonly ICentreStudentService _centreStudentService;
        //private readonly ITrainingCentreService _trainingCentreService;
        private readonly JwtSettings _jwtSettings;
        //private readonly IConfiguration _configuration;
        private readonly AppDbContext _appDbContext;

        public AuthService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IAppLogger<AuthService> logger, IMapper mapper, AppDbContext appDbContext, IOptions<JwtSettings> jwtSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            //_emailService = emailService;
            _mapper = mapper;
            //_centreAdminService = centreAdminService;
            //_jwtSettings = jwtSettings.Value;
            //_userService = userService;
            //_centreStudentService = centreStudentService;
            //_configuration = configuration;
            _appDbContext = appDbContext;
            _jwtSettings = jwtSettings.Value;
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


        //public async Task<bool> ForgotPassword(RequestForgotPasswordDto model)
        //{
        //    var user = await _userManager.FindByEmailAsync(model.Email);
        //    if (user == null)
        //    {
        //        throw new BadRequestException("Invalid payload");
        //    }
        //    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        //    if (string.IsNullOrEmpty(token))
        //    {
        //        throw new BadRequestException("Something went wrong");
        //    }

        //    var encodedToken = System.Web.HttpUtility.UrlEncode(token);
        //    var encodedEmail = System.Web.HttpUtility.UrlEncode(user.Email);
        //    //Front end URl must be moved to Appsettings Sabelo
        //    var callbackUrl = $"{_configuration["Ui:Url"]}reset-password?code={encodedToken}&email={encodedEmail}";

        //    var body = $@"
        //        <html>
        //        <head>
        //            <style>
        //                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        //                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        //                .button {{ 
        //                    display: inline-block; 
        //                    padding: 12px 24px; 
        //                    background-color: #007bff; 
        //                    color: #ffffff; 
        //                    text-decoration: none; 
        //                    border-radius: 4px; 
        //                    margin: 20px 0;
        //                }}
        //                .footer {{ margin-top: 30px; font-size: 12px; color: #666; }}
        //            </style>
        //        </head>
        //        <body>
        //            <div class='container'>
        //                <h2>Password Reset Request</h2>
        //                <p>Hello,</p>
        //                <p>You have requested to reset your password for your Trainers Council account.</p>
        //                <p>Please click the button below to reset your password:</p>
        //                <a href='{callbackUrl}' class='button'>Reset Password</a>
        //                <p>Or copy and paste this link into your browser:</p>
        //                <p style='word-break: break-all;'>{callbackUrl}</p>
        //                <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        //                <p>This link will expire in 24 hours for security reasons.</p>
        //                <div class='footer'>
        //                    <p>Best regards,<br/>Trainers Council Team</p>
        //                </div>
        //            </div>
        //        </body>
        //        </html>";

        //    var emailSend = new EmailMessage(user.Email, "Trainers council - Reset Password", body);
        //    await _emailService.SendEmailAsync(_configuration["Email:From"], "Trainers-Council", emailSend.To, emailSend.Subject, emailSend.Body, true);

        //    return true;
        //}

        //public async Task<bool> ResetPassword(ResetPasswordRequestDto model)
        //{
        //    var user = await _userManager.FindByEmailAsync(model.Email);
        //    if (user == null)
        //        throw new BadRequestException("Invalid payload");

        //    var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
        //    if (!result.Succeeded)
        //        throw new BadRequestException("Something went wrong");

        //    return true;
        //}

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


        public async Task<RegistrationResponse> RegisterStudentAsync(RegisterStudentDto registerDto)
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

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Student");


                try
                {
                    //    if (await SendWelcomeEmailAsync(user))
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





        //private async Task<bool> SendWelcomeEmailAsync(ApplicationUser user)
        //{
        //    var body = $@"
        //        <html>
        //          <body style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
        //            <p>Dear {user.FirstName},</p>

        //            <p>
        //              Welcome to <strong>Trainers Council</strong> — your trusted partner in professional security training.
        //            </p>

        //            <p>
        //              We’re thrilled to have you on board and look forward to supporting your growth and success in the security industry.
        //            </p>

        //            <p>
        //              If you have any questions or need assistance, please don’t hesitate to reach out to our support team.
        //            </p>

        //            <p>
        //              Sincerely,<br>
        //              <strong>Trainers Council Team</strong>
        //            </p>

        //            <hr style='margin-top: 20px; border: none; border-top: 1px solid #ddd;'>
        //            <p style='font-size: 12px; color: #777;'>
        //              © {DateTime.Now.Year} Trainers Council. All rights reserved.
        //            </p>
        //          </body>
        //        </html>";

        //    var emailSend = new EmailMessage(user.Email, "Welcome to Trainers Council", body);


        //    await _emailService.SendEmailAsync(_configuration["Email:From"], "Trainers-Council", emailSend.To, emailSend.Subject, emailSend.Body, true);
        //    return true;
        //}

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
