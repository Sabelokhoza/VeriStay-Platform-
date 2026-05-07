using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

     
    }
}
