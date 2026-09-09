using ko.core.Models;
using Microsoft.AspNetCore.Http;

namespace ko.core.Contracts
{

    public interface ITenancyService
    {
        Task<TenancyDto?> AddAsync(AddTenancyDto dto);
        Task<List<TenancyDto>> GetAllAsync();
        Task<TenancyDto?> GetByIdAsync(int? id);
        Task<List<TenancyDto>> GetByStudentIdAsync(string studentId);
        Task<TenancyDto> GetTenacyInfoByStudentIdAsync(string studentId);
        Task<TenancyDto> UploadLeaseDocumentAsync(int tenancyId, IFormFile leaseDocument);
        Task<List<TenancyDto>> GetByPropertyIdAsync(int propertyId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> UpdateAsync(int id, TenancyDto dto);
        Task<bool> EndTenancyAsync(int id);
        Task<List<ProfileDto>> GetHousematesByUserId(string userId);
        Task<List<ProfileDto>> GetTenanciesByProperties(List<PropertyDto> properties);
        Task<bool> onInsert(AddTenancyDto dto);
        Task<bool> afterInsert(TenancyDto dto);
        Task<bool> onUpdate(TenancyDto dto);
        Task<bool> afterUpdate(TenancyDto dto);
        Task<bool> onDelete(TenancyDto dto);
        Task<bool> afterDelete(TenancyDto dto);
    }
}
