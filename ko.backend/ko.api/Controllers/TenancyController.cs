using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TenancyController : ControllerBase
    {
        private readonly ITenancyService _tenancyService;
        private readonly IAppLogger<TenancyController> _logger;

        public TenancyController(ITenancyService tenancyService, IAppLogger<TenancyController> logger)
        {
            _tenancyService = tenancyService;
            _logger = logger;
        }

        /// <summary>
        /// Create a new tenancy — Admin and Landlord
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<TenancyDto>>> Add([FromBody] AddTenancyDto dto)
        {
            _logger.LogInformation("POST api/tenancy - Adding new tenancy");
            var result = await _tenancyService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Tenancy added successfully"));
        }

        /// <summary>
        /// Get all tenancies — Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TenancyDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/tenancy - Retrieving all tenancies");
            var result = await _tenancyService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Tenancies retrieved successfully"));
        }

        /// <summary>
        /// Get tenancy by id — All authenticated users
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<TenancyDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/tenancy/{0} - Retrieving tenancy", id);
            var result = await _tenancyService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Tenancy retrieved successfully"));
        }

        /// <summary>
        /// Get user housemates
        /// </summary>
        [HttpGet("get-housemates")]
        public async Task<ActionResult<ApiResponse<ProfileDto>>> GetHousematesByUserId(string userId)
        {
            var result = await _tenancyService.GetHousematesByUserId(userId);
            return Ok(ApiResponse.Success(result, "Housemates retrieved successfully"));
        }

        /// <summary>
        /// Get tenancies by student id — Admin and Student
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<ApiResponse<List<TenancyDto>>>> GetByStudentId(string studentId)
        {
            _logger.LogInformation("GET api/tenancy/student/{0} - Retrieving tenancies for student", studentId);
            var result = await _tenancyService.GetByStudentIdAsync(studentId);
            return Ok(ApiResponse.Success(result, "Student tenancies retrieved successfully"));
        }
        /// <summary>
        /// Get tenancies by student id — Admin and Student
        /// </summary>
        [HttpGet("get-tenancy-info")]
        public async Task<ActionResult<ApiResponse<List<TenancyDto>>>> GetTenacyInfoByStudentIdAsync(string studentId)
        {
            var result = await _tenancyService.GetTenacyInfoByStudentIdAsync(studentId);
            return Ok(ApiResponse.Success(result, "Student tenanciy retrieved successfully"));
        }

        /// <summary>
        /// Get tenancies by property id — Admin and Landlord
        /// </summary>
        [HttpGet("property/{propertyId:int}")]
        public async Task<ActionResult<ApiResponse<List<TenancyDto>>>> GetByPropertyId(int propertyId)
        {
            _logger.LogInformation("GET api/tenancy/property/{0} - Retrieving tenancies for property", propertyId);
            var result = await _tenancyService.GetByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property tenancies retrieved successfully"));
        }

        /// <summary>
        /// Update a tenancy — Admin and Landlord
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Update(int id, [FromBody] TenancyDto dto)
        {
            _logger.LogInformation("PUT api/tenancy/{0} - Updating tenancy", id);
            var result = await _tenancyService.UpdateAsync(id, dto);
            return Ok(ApiResponse.Success(result, "Tenancy updated successfully"));
        }

        /// <summary>
        /// Delete a tenancy — Admin only
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/tenancy/{0} - Deleting tenancy", id);
            var result = await _tenancyService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Tenancy deleted successfully"));
        }

        /// <summary>
        /// End an active tenancy — Admin and Landlord
        /// </summary>
        [HttpPatch("{id:int}/end")]
        public async Task<ActionResult<ApiResponse<bool>>> EndTenancy(int id)
        {
            _logger.LogInformation("PATCH api/tenancy/{0}/end - Ending tenancy", id);
            var result = await _tenancyService.EndTenancyAsync(id);
            return Ok(ApiResponse.Success(result, "Tenancy ended successfully"));
        }
    }
}