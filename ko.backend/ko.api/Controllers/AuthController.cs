using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginDto loginDto)
        {
            var result = await _authService.Login(loginDto);
            return Ok(ApiResponse.Success(result, "User logged in successfully"));
        }


        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<RegistrationResponse>>> Register([FromBody] RegisterStudentDto registerDto)
        {
            var result = await _authService.RegisterStudentAsync(registerDto);
            return Ok(ApiResponse.Success(result, "User registered successfully"));
        }

        [HttpPost("register-landlord")]
        public async Task<ActionResult<ApiResponse<RegistrationResponse>>> RegisterLandlord([FromBody] RegisterLandlordDto registerDto)
        {
            var result = await _authService.RegisterLandLordAsync(registerDto);
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
