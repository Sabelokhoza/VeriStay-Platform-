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

        /// <summary>
        /// Submit a review for a landlord/property — Student only
        /// </summary>
        [HttpPost("{studentId}")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> Add(string studentId, [FromBody] AddReviewDto dto)
        {
            _logger.LogInformation("POST api/review/{0} - Adding new review", studentId);
            var result = await _reviewService.AddAsync(studentId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Review submitted successfully"));
        }

        /// <summary>
        /// Get all reviews — Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/review - Retrieving all reviews");
            var result = await _reviewService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Reviews retrieved successfully"));
        }

        /// <summary>
        /// Get review by id — All authenticated users
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/review/{0} - Retrieving review", id);
            var result = await _reviewService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Review retrieved successfully"));
        }

        /// <summary>
        /// Get reviews for a landlord — All authenticated users
        /// </summary>
        [HttpGet("landlord/{landlordId}")]
        public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetByLandlordId(string landlordId)
        {
            _logger.LogInformation("GET api/review/landlord/{0} - Retrieving reviews for landlord", landlordId);
            var result = await _reviewService.GetByLandlordIdAsync(landlordId);
            return Ok(ApiResponse.Success(result, "Landlord reviews retrieved successfully"));
        }

        /// <summary>
        /// Get average rating for a landlord — All authenticated users
        /// </summary>
        //[HttpGet("landlord/{landlordId}/average-rating")]
        //public async Task<ActionResult<ApiResponse<double>>> GetAverageRating(string landlordId)
        //{
        //    _logger.LogInformation("GET api/review/landlord/{0}/average-rating", landlordId);
        //    var result = await _reviewService.GetAverageRatingByLandlordIdAsync(landlordId);
        //    return Ok(ApiResponse.Success(result, "Average rating retrieved successfully"));
        //}

        /// <summary>
        /// Get reviews for a property — All authenticated users
        /// </summary>
        [HttpGet("property/{propertyId:int}")]
        public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetByPropertyId(int propertyId)
        {
            _logger.LogInformation("GET api/review/property/{0} - Retrieving reviews for property", propertyId);
            var result = await _reviewService.GetByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property reviews retrieved successfully"));
        }

        /// <summary>
        /// Get reviews written by a student — Admin and Student
        /// </summary>
        //[HttpGet("student/{studentId}")]
        //public async Task<ActionResult<ApiResponse<List<ReviewDto>>>> GetByStudentId(string studentId)
        //{
        //    _logger.LogInformation("GET api/review/student/{0} - Retrieving reviews by student", studentId);
        //    var result = await _reviewService.GetByStudentIdAsync(studentId);
        //    return Ok(ApiResponse.Success(result, "Student reviews retrieved successfully"));
        //}

        /// <summary>
        /// Delete a review — Admin and the reviewing Student
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/review/{0} - Deleting review", id);
            var result = await _reviewService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Review deleted successfully"));
        }
    }
}