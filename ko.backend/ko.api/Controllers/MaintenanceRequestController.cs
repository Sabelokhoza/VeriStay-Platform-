using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceRequestController : ControllerBase
    {
        private readonly IMaintenanceRequestService _maintenanceRequestService;
        private readonly IAppLogger<MaintenanceRequestController> _logger;

        public MaintenanceRequestController(IMaintenanceRequestService maintenanceRequestService, IAppLogger<MaintenanceRequestController> logger)
        {
            _maintenanceRequestService = maintenanceRequestService;
            _logger = logger;
        }

        /// <summary>
        /// Raise a new maintenance request — Student (tenant) only
        /// </summary>
        [HttpPost("{studentId}")]
        public async Task<ActionResult<ApiResponse<MaintenanceRequestDto>>> Add(string studentId, [FromBody] AddMaintenanceRequestDto dto)
        {
            _logger.LogInformation("POST api/maintenancerequest/{0} - Adding maintenance request", studentId);
            var result = await _maintenanceRequestService.AddAsync(studentId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Maintenance request submitted successfully"));
        }

        /// <summary>
        /// Get all maintenance requests — Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<MaintenanceRequestDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/maintenancerequest - Retrieving all maintenance requests");
            var result = await _maintenanceRequestService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Maintenance requests retrieved successfully"));
        }

        /// <summary>
        /// Get maintenance request by id — All authenticated users
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<MaintenanceRequestDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/maintenancerequest/{0} - Retrieving maintenance request", id);
            var result = await _maintenanceRequestService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Maintenance request retrieved successfully"));
        }

        /// <summary>
        /// Get maintenance requests by student id — Admin and Student
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<ApiResponse<List<MaintenanceRequestDto>>>> GetByStudentId(string studentId)
        {
            _logger.LogInformation("GET api/maintenancerequest/student/{0} - Retrieving maintenance requests for student", studentId);
            var result = await _maintenanceRequestService.GetByStudentIdAsync(studentId);
            return Ok(ApiResponse.Success(result, "Student maintenance requests retrieved successfully"));
        }

        /// <summary>
        /// Get maintenance requests by property id — Admin and Landlord
        /// </summary>
        [HttpGet("property/{propertyId:int}")]
        public async Task<ActionResult<ApiResponse<List<MaintenanceRequestDto>>>> GetByPropertyId(int propertyId)
        {
            _logger.LogInformation("GET api/maintenancerequest/property/{0} - Retrieving maintenance requests for property", propertyId);
            var result = await _maintenanceRequestService.GetByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property maintenance requests retrieved successfully"));
        }


        /// <summary>
        /// Delete a maintenance request — Admin and Student
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/maintenancerequest/{0} - Deleting maintenance request", id);
            var result = await _maintenanceRequestService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Maintenance request deleted successfully"));
        }

    }
}