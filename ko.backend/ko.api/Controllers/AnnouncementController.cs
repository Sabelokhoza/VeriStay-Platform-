using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;
        private readonly IAppLogger<AnnouncementController> _logger;

        public AnnouncementController(IAnnouncementService announcementService, IAppLogger<AnnouncementController> logger)
        {
            _announcementService = announcementService;
            _logger = logger;
        }

        /// <summary>
        /// Add a new announcement — Landlord only
        /// </summary>
        [HttpPost("{landlordId}")]
        public async Task<ActionResult<ApiResponse<AnnouncementDto>>> Add(string landlordId, [FromBody] AddAnnouncementDto dto)
        {
            _logger.LogInformation("POST api/announcement/{0} - Adding new announcement", landlordId);
            var result = await _announcementService.AddAsync(landlordId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Announcement added successfully"));
        }

        /// <summary>
        /// Get all announcements — Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<AnnouncementDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/announcement - Retrieving all announcements");
            var result = await _announcementService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Announcements retrieved successfully"));
        }

        /// <summary>
        /// Get announcement by id — All authenticated users
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<AnnouncementDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/announcement/{0} - Retrieving announcement", id);
            var result = await _announcementService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Announcement retrieved successfully"));
        }

        /// <summary>
        /// Get announcements by property id — All authenticated users
        /// </summary>
        [HttpGet("property/{propertyId:int}")]
        public async Task<ActionResult<ApiResponse<List<AnnouncementDto>>>> GetByPropertyId(int propertyId)
        {
            _logger.LogInformation("GET api/announcement/property/{0} - Retrieving announcements for property", propertyId);
            var result = await _announcementService.GetByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property announcements retrieved successfully"));
        }

        /// <summary>
        /// Update an announcement — Landlord only
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Update(int id, [FromBody] AnnouncementDto dto)
        {
            _logger.LogInformation("PUT api/announcement/{0} - Updating announcement", id);
            var result = await _announcementService.UpdateAsync(id, dto);
            return Ok(ApiResponse.Success(result, "Announcement updated successfully"));
        }

        [HttpGet("landlord/{landlordId}")]
        public async Task<ActionResult<ApiResponse<List<AnnouncementDto>>>> GetByLandlordId(
            string landlordId)
        {
            var result = await _announcementService.GetByLandlordIdAsync(landlordId);
            return Ok(ApiResponse.Success(result, "Announcements retrieved successfully"));
        }

        /// <summary>
        /// Delete an announcement — Admin and Landlord
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/announcement/{0} - Deleting announcement", id);
            var result = await _announcementService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Announcement deleted successfully"));
        }
    }
}