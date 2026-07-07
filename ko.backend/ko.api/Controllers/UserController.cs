using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("get-user-by-id")]
        public async Task<ActionResult<ApiResponse<ProfileDto>>> GetUser(string user_id)
        {
            var user = await _userService.GetUser(user_id);
            return Ok(ApiResponse.Success(user, "User retrieved successfully"));
        }

        [HttpGet("update-landlord-status")]
        public async Task<ActionResult<ApiResponse<ProfileDto>>> UpdateLandLordStatus(string user_id , bool isAppproved)
        {
            var user = await _userService.UpdateLandLordStatus(user_id , isAppproved);
            return Ok(ApiResponse.Success(user, "Landlord status updated successfully"));
        }
    }
}
