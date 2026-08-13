using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserService _userService;
        private readonly  UserManager<ApplicationUser> _userManager;

        public UserController(IUserService userService, UserManager<ApplicationUser> userManager)
        {
            _userService = userService;
            _userManager = userManager;
        }

        [HttpGet("get-user-by-id")]
        public async Task<ActionResult<ApiResponse<ProfileDto>>> GetUser(string user_id)
        {
            var user = await _userService.GetUser(user_id);
            return Ok(ApiResponse.Success(user, "User retrieved successfully"));
        }
        [HttpGet("get-student-dashboarddata")]
        public async Task<ActionResult<ApiResponse<StudentDashboardDataDto>>> GetStudentDashboardData(string user_id)
        {
            var studentDashboardDataDto = await _userService.GetStudentDashboardData(user_id);
            return Ok(ApiResponse.Success(studentDashboardDataDto, "Student Dashboard data retrieved successfully"));
        }

        [HttpGet("get-landlord-dashboarddata")]
        public async Task<ActionResult<ApiResponse<StudentDashboardDataDto>>> GetLandlordDashboardData(string user_id)
        {
            var studentDashboardDataDto = await _userService.GetLandlordDashboardData(user_id);
            return Ok(ApiResponse.Success(studentDashboardDataDto, "Landlord Dashboard data retrieved successfully"));
        }
        [HttpGet("get-admin-dashboard")]
        public async Task<ActionResult<ApiResponse<StudentDashboardDataDto>>> GetAdminDashboardData()
        {
            var dummy = string.Empty;
            var studentDashboardDataDto = await _userService.GetAdminDashboardData(dummy);
            return Ok(ApiResponse.Success(studentDashboardDataDto, "admin Dashboard data retrieved successfully"));
        }

        [HttpPost("update-landlord-status")]
        public async Task<ActionResult<ApiResponse<ProfileDto>>> UpdateLandLordStatus([FromQuery] string user_id, [FromQuery] bool isAppproved)
        {
            var user = await _userService.UpdateLandLordStatus(user_id, isAppproved);
            return Ok(ApiResponse.Success(user, "Landlord status updated successfully"));
        }
        [HttpPost("update-fcm-token")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateFcmToken(
    [FromBody] UpdateFcmTokenDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null) return NotFound();

            user.FcmToken = dto.FcmToken;
            await _userManager.UpdateAsync(user);
            return Ok(ApiResponse.Success(true, "FCM token updated"));
        }
    }
}
