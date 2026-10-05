using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IAppLogger<AdminController> _logger;

        public AdminController(IAdminService adminService, IAppLogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }


        [HttpGet("disputes")]
        public async Task<ActionResult<ApiResponse<List<DisputeDto>>>> GetDisputes()
        {
            var result = await _adminService.GetAllDisputesAsync();
            return Ok(ApiResponse.Success(result, "Disputes retrieved"));
        }

        [HttpPost("disputes")]
        public async Task<ActionResult<ApiResponse<DisputeDto>>> AddDispute(
            [FromBody] AddDisputeDto dto)
        {
            var result = await _adminService.AddDisputeAsync(dto);
            return Ok(ApiResponse.Success(result, "Dispute filed successfully"));
        }

        [HttpPut("disputes/{id:int}")]
        public async Task<ActionResult<ApiResponse<DisputeDto>>> UpdateDispute(
            int id, [FromBody] UpdateDisputeDto dto)
        {
            var result = await _adminService.UpdateDisputeAsync(id, dto);
            return Ok(ApiResponse.Success(result, "Dispute updated"));
        }

        [HttpPatch("disputes/resolve")]
        public async Task<ActionResult<ApiResponse<DisputeDto>>> ResolveDispute(
            [FromBody] ResolveDisputeDto dto)
        {
            var result = await _adminService.ResolveDisputeAsync(dto);
            return Ok(ApiResponse.Success(result, "Dispute resolved"));
        }

        [HttpGet("disputes/landlord/{landlordId}")]
        public async Task<ActionResult<ApiResponse<List<DisputeDto>>>> GetLandlordDisputes(string landlordId)
        {
            var result = await _adminService.GetDisputesByLandlordAsync(landlordId);
            return Ok(ApiResponse.Success(result, "Disputes retrieved"));
        }

        [HttpPatch("disputes/{id:int}/landlord-response")]
        public async Task<ActionResult<ApiResponse<DisputeDto>>> RespondToDispute(
            int id, [FromBody] LandlordResponseDto dto)
        {
            var result = await _adminService.RespondToDisputeAsync(id, dto);
            return Ok(ApiResponse.Success(result, "Response sent"));
        }


        [HttpGet("complaints")]
        public async Task<ActionResult<ApiResponse<List<ComplaintDto>>>> GetComplaints()
        {
            var result = await _adminService.GetAllComplaintsAsync();
            return Ok(ApiResponse.Success(result, "Complaints retrieved"));
        }

        [HttpPost("complaints")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<ComplaintDto>>> AddComplaint(
            [FromBody] AddComplaintDto dto)
        {
            var result = await _adminService.AddComplaintAsync(dto);
            return Ok(ApiResponse.Success(result, "Complaint submitted"));
        }

        [HttpPut("complaints/{id:int}")]
        public async Task<ActionResult<ApiResponse<ComplaintDto>>> UpdateComplaint(
            int id, [FromBody] UpdateComplaintDto dto)
        {
            var result = await _adminService.UpdateComplaintAsync(id, dto);
            return Ok(ApiResponse.Success(result, "Complaint updated"));
        }

        [HttpPatch("complaints/{id}/status")]
        public async Task<ActionResult<ApiResponse<ComplaintDto>>> UpdateComplaintStatus(
            int id, [FromBody] UpdateComplaintStatusDto dto)
        {
            var result = await _adminService.UpdateComplaintStatusAsync(
                id, dto.Status, dto.AdminNotes);
            return Ok(ApiResponse.Success(result, "Complaint status updated"));
        }

        [HttpPost("complaints/{id}/notify")]
        public async Task<ActionResult<ApiResponse<bool>>> NotifyComplaint(int id)
        {
            var result = await _adminService.NotifyComplaintAsync(id);
            return Ok(ApiResponse.Success(result, "Notification sent"));
        }

        [HttpGet("complaints/landlord/{landlordId}")]
        public async Task<ActionResult<ApiResponse<List<ComplaintDto>>>> GetLandlordComplaints(string landlordId)
        {
            var result = await _adminService.GetComplaintsByLandlordAsync(landlordId);
            return Ok(ApiResponse.Success(result, "Complaints retrieved"));
        }

        [HttpPatch("complaints/{id:int}/landlord-response")]
        public async Task<ActionResult<ApiResponse<ComplaintDto>>> RespondToComplaint(
            int id, [FromBody] LandlordResponseDto dto)
        {
            var result = await _adminService.RespondToComplaintAsync(id, dto);
            return Ok(ApiResponse.Success(result, "Response sent"));
        }


        [HttpGet("users")]
        public async Task<ActionResult<ApiResponse<List<UserAccountDto>>>> GetUsers()
        {
            var result = await _adminService.GetAllUsersAsync();
            return Ok(ApiResponse.Success(result, "Users retrieved"));
        }

        [HttpPatch("users/{userId}/toggle-active")]
        public async Task<ActionResult<ApiResponse<bool>>> ToggleUserActive(string userId)
        {
            var result = await _adminService.ToggleUserActiveAsync(userId);
            return Ok(ApiResponse.Success(result,
                result ? "User activated" : "User deactivated"));
        }

        [HttpPut("users/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<UserAccountDto>>> UpdateUser(
            string userId, [FromBody] UpdateUserAccountDto dto)
        {
            var result = await _adminService.UpdateUserAsync(userId, dto);
            return Ok(ApiResponse.Success(result, "User updated"));
        }

        [HttpDelete("users/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(string userId)
        {
            var result = await _adminService.DeleteUserAsync(userId, User.FindFirst("uid")?.Value);
            return Ok(ApiResponse.Success(result, "User deleted"));
        }

        [HttpPost("landlords/suspend")]
        public async Task<ActionResult<ApiResponse<bool>>> SuspendLandlord(
            [FromBody] SuspendLandlordDto dto)
        {
            var result = await _adminService.SuspendLandlordAsync(dto);
            return Ok(ApiResponse.Success(result,
                dto.IsSuspended ? "Landlord suspended" : "Landlord reinstated"));
        }


        [HttpGet("accommodation-report")]
        public async Task<ActionResult<ApiResponse<AccommodationReportDto>>> GetReport()
        {
            var result = await _adminService.GetAccommodationReportAsync();
            return Ok(ApiResponse.Success(result, "Report generated"));
        }
    }
}
