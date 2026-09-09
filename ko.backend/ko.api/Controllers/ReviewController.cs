using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly IAppLogger<ReviewController> _logger;

        public ReviewController(IReviewService reviewService, IAppLogger<ReviewController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }

        [HttpPost("{studentId}")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> Add(string studentId, [FromBody] AddReviewDto dto)
        {
            _logger.LogInformation("POST api/review/{0} - Adding new review", studentId);
            var result = await _reviewService.AddAsync(studentId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Review submitted successfully"));
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/review - Retrieving all reviews");
            var result = await _reviewService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Reviews retrieved successfully"));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/review/{0} - Retrieving review", id);
            var result = await _reviewService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Review retrieved successfully"));
        }

        [HttpGet("landlord/{landlordId}")]
        public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetByLandlordId(string landlordId)
        {
            _logger.LogInformation("GET api/review/landlord/{0} - Retrieving reviews for landlord", landlordId);
            var result = await _reviewService.GetByLandlordIdAsync(landlordId);
            return Ok(ApiResponse.Success(result, "Landlord reviews retrieved successfully"));
        }


        [HttpGet("property/{propertyId:int}")]
        public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetByPropertyId(int propertyId)
        {
            _logger.LogInformation("GET api/review/property/{0} - Retrieving reviews for property", propertyId);
            var result = await _reviewService.GetByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property reviews retrieved successfully"));
        }


        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/review/{0} - Deleting review", id);
            var result = await _reviewService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Review deleted successfully"));
        }
    }
}