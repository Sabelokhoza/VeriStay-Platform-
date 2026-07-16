using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly IAppLogger<ApplicationController> _logger;

        public ApplicationController(IApplicationService applicationService, IAppLogger<ApplicationController> logger)
        {
            _applicationService = applicationService;
            _logger = logger;
        }

        // =============================================
        // CRUD
        // =============================================

        /// <summary>
        /// Add a new application — Student only
        /// </summary>
        [HttpPost("apply")]
        public async Task<ActionResult<ApiResponse<ApplicationDto>>> Add([FromBody] AddApplicationDto dto)
        {
            _logger.LogInformation("POST api/application/{0} - Adding new application", dto.studentId);
            var result = await _applicationService.AddAsync(dto.studentId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Application added successfully"));
        }

        /// <summary>
        /// Get all applications — Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ApplicationDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/application - Retrieving all applications");
            var result = await _applicationService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Applications retrieved successfully"));
        }

        /// <summary>
        /// Get application by id — All authenticated users
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<ApplicationDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/application/{0} - Retrieving application", id);
            var result = await _applicationService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Application retrieved successfully"));
        }

        /// <summary>
        /// Get all applications by student id — Admin and Student
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<ApiResponse<List<ApplicationDto>>>> GetByStudentId(string studentId)
        {
            _logger.LogInformation("GET api/application/student/{0} - Retrieving applications for student", studentId);
            var result = await _applicationService.GetByStudentIdAsync(studentId);
            return Ok(ApiResponse.Success(result, "Student applications retrieved successfully"));
        }

        /// <summary>
        /// Get all applications by property id — Admin and Landlord
        /// </summary>
        [HttpGet("property/{propertyId:int}")]
        public async Task<ActionResult<ApiResponse<List<ApplicationDto>>>> GetByPropertyId(int propertyId)
        {
            _logger.LogInformation("GET api/application/property/{0} - Retrieving applications for property", propertyId);
            var result = await _applicationService.GetByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property applications retrieved successfully"));
        }

        /// <summary>
        /// Delete application — Admin and Student
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/application/{0} - Deleting application", id);
            var result = await _applicationService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Application deleted successfully"));
        }

        // =============================================
        // Review
        // =============================================

        /// <summary>
        /// Review (approve/reject) an application — Admin and Landlord
        /// </summary>
        [HttpPatch("review")]
        public async Task<ActionResult<ApiResponse<bool>>> Review([FromBody] ReviewApplicationDto dto)
        {
            _logger.LogInformation("PATCH api/application/review - Reviewing application {0}", dto.ApplicationId);
            var result = await _applicationService.ReviewAsync(dto);
            return Ok(ApiResponse.Success(result, "Application reviewed successfully"));
        }

        /// <summary>
        /// Accept/Decline Offer for an application — Student only
        /// </summary>
        [HttpGet("accept-decline")]
        public async Task<ActionResult<ApiResponse<bool>>> Review(int applicationId , bool isAccepted = false)
        {
            var result = await _applicationService.AcceptDeclineOffer(applicationId,isAccepted);
            return Ok(ApiResponse.Success(result, "Apllication status updated successfully"));
        }
    }
}