using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WaitingListController : ControllerBase
    {
        private readonly IWaitingListService _waitingListService;
        private readonly IAppLogger<WaitingListController> _logger;

        public WaitingListController(IWaitingListService waitingListService, IAppLogger<WaitingListController> logger)
        {
            _waitingListService = waitingListService;
            _logger = logger;
        }

        /// <summary>
        /// Add a student to a property's waiting list — Student only
        /// </summary>
        [HttpPost("{studentId}")]
        public async Task<ActionResult<ApiResponse<WaitingListEntryDto>>> Add(string studentId, [FromBody] AddWaitingListEntryDto dto)
        {
            _logger.LogInformation("POST api/waitinglist/{0} - Adding waiting list entry", studentId);
            var result = await _waitingListService.AddAsync(studentId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Waiting list entry added successfully"));
        }

        /// <summary>
        /// Get all waiting list entries — Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<WaitingListEntryDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/waitinglist - Retrieving all waiting list entries");
            var result = await _waitingListService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Waiting list entries retrieved successfully"));
        }

        /// <summary>
        /// Get waiting list entry by id — All authenticated users
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<WaitingListEntryDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/waitinglist/{0} - Retrieving waiting list entry", id);
            var result = await _waitingListService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Waiting list entry retrieved successfully"));
        }

        /// <summary>
        /// Get waiting list entries by property id — Admin and Landlord
        /// </summary>
        [HttpGet("property/{propertyId:int}")]
        public async Task<ActionResult<ApiResponse<List<WaitingListEntryDto>>>> GetByPropertyId(int propertyId)
        {
            _logger.LogInformation("GET api/waitinglist/property/{0} - Retrieving waiting list entries for property", propertyId);
            var result = await _waitingListService.GetByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property waiting list retrieved successfully"));
        }

        /// <summary>
        /// Get waiting list entries by student id — Admin and Student
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<ApiResponse<List<WaitingListEntryDto>>>> GetByStudentId(string studentId)
        {
            _logger.LogInformation("GET api/waitinglist/student/{0} - Retrieving waiting list entries for student", studentId);
            var result = await _waitingListService.GetByStudentIdAsync(studentId);
            return Ok(ApiResponse.Success(result, "Student waiting list entries retrieved successfully"));
        }

        /// <summary>
        /// Remove an entry from the waiting list — Admin and Student
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/waitinglist/{0} - Deleting waiting list entry", id);
            var result = await _waitingListService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Waiting list entry deleted successfully"));
        }

        /// <summary>
        /// Notify the next eligible student on a property's waiting list — Admin and Landlord
        /// </summary>
        [HttpPatch("property/{propertyId:int}/notify-next")]
        public async Task<ActionResult<ApiResponse<bool>>> NotifyNext(int propertyId)
        {
            _logger.LogInformation("PATCH api/waitinglist/property/{0}/notify-next", propertyId);
            var result = await _waitingListService.NotifyNextAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Next student notified successfully"));
        }
    }
}