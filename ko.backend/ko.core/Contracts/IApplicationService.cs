using ko.core.Models;

namespace ko.core.Contracts
{
    // =============================================
    // IApplicationService
    // =============================================

    public interface IApplicationService
    {
        Task<ApplicationDto?> AddAsync(string studentId, AddApplicationDto dto);
        Task<List<ApplicationDto>> GetAllAsync();
        Task<ApplicationDto?> GetByIdAsync(int? id);
        Task<List<ApplicationDto>> GetByStudentIdAsync(string studentId);
        Task<List<ApplicationDto>> GetByPropertyIdAsync(int propertyId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> ReviewAsync(ReviewApplicationDto dto);
        Task<bool> AcceptDeclineOffer(int applicationId, bool isAcccepted);
        // Events
        Task<bool> onInsert(AddApplicationDto dto);
        Task<bool> afterInsert(ApplicationDto dto);
        Task<bool> onUpdate(ApplicationDto dto);
        Task<bool> afterUpdate(ApplicationDto dto);
        Task<bool> onDelete(ApplicationDto dto);
        Task<bool> afterDelete(ApplicationDto dto);
    }
}
