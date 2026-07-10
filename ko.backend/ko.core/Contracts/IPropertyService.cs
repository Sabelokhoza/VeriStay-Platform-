using ko.core.Models;

namespace ko.core.Contracts
{
    public interface IPropertyService
    {
        Task<PropertyDto?> AddAsync(AddPropertyDto dto);
        Task<List<PropertyDto>> GetAllAsync();
        Task<PropertyDto?> GetByIdAsync(int? id);
        Task<List<PropertyDto>> GetByLandlordIdAsync(string landlordId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> UpdateAsync(int id, PropertyDto dto);
        Task<bool> ApproveAsync(int id);
        Task<bool> RejectAsync(int id);
        // Events
        Task<bool> onInsert(AddPropertyDto dto);
        Task<bool> afterInsert(PropertyDto dto);
        Task<bool> onUpdate(PropertyDto dto);
        Task<bool> afterUpdate(PropertyDto dto);
        Task<bool> onDelete(PropertyDto dto);
        Task<bool> afterDelete(PropertyDto dto);

        Task<List<PropertyDto>> GetApprovedAsync();

        // =============================================
        // Status Management
        // =============================================
        Task<bool> DelistAsync(int id);
        Task<bool> ToggleAvailabilityAsync(int id);

        // =============================================
        // Search
        // =============================================
        Task<List<PropertyDto>> SearchAsync(
            string? city = null,
            decimal? minRent = null,
            decimal? maxRent = null,
            int? minBeds = null,
            string? amenity = null);

        // =============================================
        // Property Images
        // =============================================
        Task<PropertyImageDto?> AddImageAsync(AddPropertyImageDto dto);
        Task<List<PropertyImageDto>> GetImagesByPropertyIdAsync(int propertyId);
        Task<bool> DeleteImageAsync(int imageId);
        Task<bool> SetPrimaryImageAsync(int imageId);
        Task<List<ListingDto>> GetListings();
        Task<ListingDetailsDto> GetListingDetailsbyPropertyId(int id);
        Task<List<ListingDto>> GetListings(
              string? city = null,
              string? title = null,
              string? address = null,
              string? description = null);
    }
}
