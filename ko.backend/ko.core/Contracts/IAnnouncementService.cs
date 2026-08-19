using ko.core.Models;

namespace ko.core.Contracts
{
    // =============================================
    // IAnnouncementService
    // =============================================

    public interface IAnnouncementService
    {
        Task<AnnouncementDto?> AddAsync(string landlordId, AddAnnouncementDto dto);
        Task<List<AnnouncementDto>> GetAllAsync();
        Task<AnnouncementDto?> GetByIdAsync(int? id);
        Task<List<AnnouncementDto>> GetByPropertyIdAsync(int propertyId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> UpdateAsync(int id, AnnouncementDto dto);
        Task<List<AnnouncementDto>> GetByLandlordIdAsync(string landlordId);
        // Events
        Task<bool> onInsert(AddAnnouncementDto dto);
        Task<bool> afterInsert(AnnouncementDto dto);
        Task<bool> onUpdate(AnnouncementDto dto);
        Task<bool> afterUpdate(AnnouncementDto dto);
        Task<bool> onDelete(AnnouncementDto dto);
        Task<bool> afterDelete(AnnouncementDto dto);
    }
}
