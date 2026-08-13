using ko.core.Contracts;
using ko.core.Models;
using ko.core.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ko.api.Controllers
{
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;
        private readonly INotificationService _notificationService;

        public AuthController(IAuthService authService, INotificationService notificationService)
        {
            _authService = authService;
            _notificationService = notificationService;
        }

        [HttpPost("test-notification")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> SendToUserAsync(string userId)
        {
            await _notificationService.SendToUserAsync(userId, "Testing", "lets go", "payment");
            return Ok(ApiResponse.Success(null, "Notification sent successfully"));
        }
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginDto loginDto)
        {
            var result = await _authService.Login(loginDto);
            return Ok(ApiResponse.Success(result, "User logged in successfully"));
        }


        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<RegistrationResponse>>> Register([Required(ErrorMessage ="Proof of registration is Required")] IFormFile proofOfRegistration, [Required(ErrorMessage = "Proof of income/funding is Required")] IFormFile proofOfIncome, [FromQuery] RegisterStudentDto registerDto)
        {
            var result = await _authService.RegisterStudentAsync(proofOfIncome,proofOfRegistration, registerDto);
            return Ok(ApiResponse.Success(result, "User registered successfully"));
        }

        [HttpPost("register-landlord")]
        public async Task<ActionResult<ApiResponse<RegistrationResponse>>> RegisterLandlord([Required(ErrorMessage = "Identification document is Required")] IFormFile identificationDocument, [FromQuery] RegisterLandlordDto registerDto)
        {
            var result = await _authService.RegisterLandLordAsync(identificationDocument, registerDto);
            return Ok(ApiResponse.Success(result, "User registered successfully"));
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ResetPassword(ResetPasswordRequestDto resetPasswordRequestDto)
        {
            var result = await _authService.ResetPassword(resetPasswordRequestDto);
            return Ok(ApiResponse.Success(result, "Password reset sucessfully successfully"));
        }
        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<bool>>> ForgotPassword(RequestForgotPasswordDto requestForgotPasswordDto)
        {
            var result = await _authService.ForgotPassword(requestForgotPasswordDto);
            return Ok(ApiResponse.Success(result, "Check emails to reset password"));
        }

    }
}
