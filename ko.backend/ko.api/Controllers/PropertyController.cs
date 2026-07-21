using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ko.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly IAppLogger<PropertyController> _logger;

        public PropertyController(IPropertyService propertyService, IAppLogger<PropertyController> logger)
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        // =============================================
        // CRUD
        // =============================================

        /// <summary>
        /// Add a new property — Landlord only
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<PropertyDto>>> Add([FromBody] AddPropertyDto dto)
        {
            _logger.LogInformation("POST api/property - Adding new property");
            var result = await _propertyService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id },
                ApiResponse.Success(result, "Property added successfully"));
        }

        /// <summary>
        /// Get all properties — Admin only
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<PropertyDto>>>> GetAll()
        {
            _logger.LogInformation("GET api/property - Retrieving all properties");
            var result = await _propertyService.GetAllAsync();
            return Ok(ApiResponse.Success(result, "Properties retrieved successfully"));
        }

        /// <summary>
        /// Get property by id — All authenticated users
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<PropertyDto>>> GetById(int id)
        {
            _logger.LogInformation("GET api/property/{0} - Retrieving property", id);
            var result = await _propertyService.GetByIdAsync(id);
            return Ok(ApiResponse.Success(result, "Property retrieved successfully"));
        }

        /// <summary>
        /// Get all properties by landlord id — Admin and Landlord
        /// </summary>
        [HttpGet("landlord/{landlordId}")]
        public async Task<ActionResult<ApiResponse<List<PropertyDto>>>> GetByLandlordId(string landlordId)
        {
            _logger.LogInformation("GET api/property/landlord/{0} - Retrieving properties for landlord", landlordId);
            var result = await _propertyService.GetByLandlordIdAsync(landlordId);
            return Ok(ApiResponse.Success(result, "Landlord properties retrieved successfully"));
        }

        /// <summary>
        /// Get all approved and available properties — All authenticated users
        /// </summary>
        [HttpGet("approved")]
        public async Task<ActionResult<ApiResponse<List<PropertyDto>>>> GetApproved()
        {
            _logger.LogInformation("GET api/property/approved - Retrieving approved properties");
            var result = await _propertyService.GetApprovedAsync();
            return Ok(ApiResponse.Success(result, "Approved properties retrieved successfully"));
        }

        [HttpGet("get-listings")]
        public async Task<ActionResult<ApiResponse<List<ListingDto>>>> GetListings(
             [FromQuery] string? city = null,
             [FromQuery] string? title = null,
             [FromQuery] string? address = null,
             [FromQuery] string? description = null)
        {
            _logger.LogInformation("GET api/property/get-listings - Retrieving listings");
            var result = await _propertyService.GetListings(city, title, address, description);
            return Ok(ApiResponse.Success(result, "Listings retrieved successfully"));
        }

        /// <summary>
        /// Get listings by details id
        /// </summary>
        [HttpGet("get-listing-by-details-id")]
        public async Task<ActionResult<ApiResponse<ListingDetailsDto>>> GetListingsDetailsbyPropertyId(int propertyId )
        {
            _logger.LogInformation("GET api/property/get-listings - Retrieving listings");
            var result = await _propertyService.GetListingDetailsbyPropertyId(propertyId);
            return Ok(ApiResponse.Success(result, "Listings details retrieved successfully"));
        }

        /// <summary>
        /// Get  property details by id
        /// </summary>
        [HttpGet("get-property-info")]
        public async Task<ActionResult<ApiResponse<ListingDetailsDto>>> GetProperyInfoAsync(int propertyId)
        {
            _logger.LogInformation("GET api/property/get-property-info - Retrieving listings");
            var result = await _propertyService.GetProperyInfoAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Listings details retrieved successfully"));
        }

        /// <summary>
        /// Search approved properties with filters — All authenticated users
        /// </summary>
        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<List<PropertyDto>>>> Search(
            [FromQuery] string? city = null,
            [FromQuery] decimal? minRent = null,
            [FromQuery] decimal? maxRent = null,
            [FromQuery] int? minBeds = null,
            [FromQuery] string? amenity = null)
        {
            _logger.LogInformation("GET api/property/search - Searching properties");
            var result = await _propertyService.SearchAsync(city, minRent, maxRent, minBeds, amenity);
            return Ok(ApiResponse.Success(result, "Search completed successfully"));
        }

        /// <summary>
        /// Update property — Landlord only
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Update(int id, [FromBody] PropertyDto dto)
        {
            _logger.LogInformation("PUT api/property/{0} - Updating property", id);
            var result = await _propertyService.UpdateAsync(id, dto);
            return Ok(ApiResponse.Success(result, "Property updated successfully"));
        }
        /// <summary>
        /// Update a property — Landlord only
        /// </summary>
        [HttpPut("update-propery/{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateProperty(
            int id,
            [FromBody] UpdatePropertyDto dto)
        {
            _logger.LogInformation("PUT api/property/{PropertyId}", id);

            var result = await _propertyService.UpdatePropertyAsync(id, dto);

            return Ok(ApiResponse.Success(true, "Property updated successfully."));
        }
        /// <summary>
        /// Delete property — Admin and Landlord
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            _logger.LogInformation("DELETE api/property/{0} - Deleting property", id);
            var result = await _propertyService.DeleteAsync(id);
            return Ok(ApiResponse.Success(result, "Property deleted successfully"));
        }

        // =============================================
        // Status Management
        // =============================================

        /// <summary>
        /// Approve a property listing — Admin only
        /// </summary>
        [HttpPatch("{id:int}/approve")]
        public async Task<ActionResult<ApiResponse<bool>>> Approve(int id)
        {
            _logger.LogInformation("PATCH api/property/{0}/approve - Approving property", id);
            var result = await _propertyService.ApproveAsync(id);
            return Ok(ApiResponse.Success(result, "Property approved successfully"));
        }

        /// <summary>
        /// Reject a property listing — Admin only
        /// </summary>
        [HttpPatch("{id:int}/reject")]
        public async Task<ActionResult<ApiResponse<bool>>> Reject(int id)
        {
            _logger.LogInformation("PATCH api/property/{0}/reject - Rejecting property", id);
            var result = await _propertyService.RejectAsync(id);
            return Ok(ApiResponse.Success(result, "Property rejected successfully"));
        }

        /// <summary>
        /// Delist a property — Admin and Landlord
        /// </summary>
        [HttpPatch("{id:int}/delist")]
        public async Task<ActionResult<ApiResponse<bool>>> Delist(int id)
        {
            _logger.LogInformation("PATCH api/property/{0}/delist - Delisting property", id);
            var result = await _propertyService.DelistAsync(id);
            return Ok(ApiResponse.Success(result, "Property delisted successfully"));
        }

        /// <summary>
        /// Toggle property availability — Landlord only
        /// </summary>
        [HttpPatch("{id:int}/toggle-availability")]
        public async Task<ActionResult<ApiResponse<bool>>> ToggleAvailability(int id)
        {
            _logger.LogInformation("PATCH api/property/{0}/toggle-availability", id);
            var result = await _propertyService.ToggleAvailabilityAsync(id);
            return Ok(ApiResponse.Success(result, "Property availability updated successfully"));
        }

        // =============================================
        // Property Images
        // =============================================

        /// <summary>
        /// Add an image to a property — Landlord only
        /// </summary>
        [HttpPost("add-image")]
        public async Task<ActionResult<ApiResponse<PropertyImageDto>>> AddImage(
            IFormFile image,
            [FromQuery] int propertyId,
            [FromQuery] bool isPrimary)
        {
            _logger.LogInformation("POST api/property/add-image - Adding image to property {0}", propertyId);
            var dto = new AddPropertyImageDto
            {
                PropertyId = propertyId,
                image = image,
                IsPrimary = isPrimary
            };
            var result = await _propertyService.AddImageAsync(dto);
            return CreatedAtAction(nameof(GetImagesForProperty), new { propertyId = dto.PropertyId },
                ApiResponse.Success(result, "Image added successfully"));
        }

        /// <summary>
        /// Get all images for a property — All authenticated users
        /// </summary>
        [HttpGet("{propertyId:int}/images")]
        public async Task<ActionResult<ApiResponse<List<PropertyImageDto>>>> GetImagesForProperty(int propertyId)
        {
            _logger.LogInformation("GET api/property/{0}/images - Retrieving images", propertyId);
            var result = await _propertyService.GetImagesByPropertyIdAsync(propertyId);
            return Ok(ApiResponse.Success(result, "Property images retrieved successfully"));
        }

        /// <summary>
        /// Delete a property image — Admin and Landlord
        /// </summary>
        [HttpDelete("images/{imageId:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteImage(int imageId)
        {
            _logger.LogInformation("DELETE api/property/images/{0} - Deleting image", imageId);
            var result = await _propertyService.DeleteImageAsync(imageId);
            return Ok(ApiResponse.Success(result, "Image deleted successfully"));
        }

        /// <summary>
        /// Set an image as the primary image for a property — Landlord only
        /// </summary>
        [HttpPatch("images/{imageId:int}/set-primary")]
        public async Task<ActionResult<ApiResponse<bool>>> SetPrimaryImage(int imageId)
        {
            _logger.LogInformation("PATCH api/property/images/{0}/set-primary", imageId);
            var result = await _propertyService.SetPrimaryImageAsync(imageId);
            return Ok(ApiResponse.Success(result, "Primary image set successfully"));
        }
    }
}