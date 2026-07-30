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

        // ── Disputes ──────────────────────────────────────────────────────

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

        [HttpPatch("disputes/resolve")]
        public async Task<ActionResult<ApiResponse<DisputeDto>>> ResolveDispute(
            [FromBody] ResolveDisputeDto dto)
        {
            var result = await _adminService.ResolveDisputeAsync(dto);
            return Ok(ApiResponse.Success(result, "Dispute resolved"));
        }

        // ── Complaints ────────────────────────────────────────────────────

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

        // ── Users ─────────────────────────────────────────────────────────

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

        [HttpPost("landlords/suspend")]
        public async Task<ActionResult<ApiResponse<bool>>> SuspendLandlord(
            [FromBody] SuspendLandlordDto dto)
        {
            var result = await _adminService.SuspendLandlordAsync(dto);
            return Ok(ApiResponse.Success(result,
                dto.IsSuspended ? "Landlord suspended" : "Landlord reinstated"));
        }

        // ── Report ────────────────────────────────────────────────────────

        [HttpGet("accommodation-report")]
        public async Task<ActionResult<ApiResponse<AccommodationReportDto>>> GetReport()
        {
            var result = await _adminService.GetAccommodationReportAsync();
            return Ok(ApiResponse.Success(result, "Report generated"));
        }
    }
}
