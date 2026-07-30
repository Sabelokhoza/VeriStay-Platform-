using ko.core.Models;
using ko.entity_framework.entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ko.core.Contracts
{
    public interface IAdminService
    {
        // Disputes
        Task<List<DisputeDto>> GetAllDisputesAsync();
        Task<DisputeDto> AddDisputeAsync(AddDisputeDto dto);
        Task<DisputeDto> ResolveDisputeAsync(ResolveDisputeDto dto);

        // Complaints
        Task<List<ComplaintDto>> GetAllComplaintsAsync();
        Task<ComplaintDto> AddComplaintAsync(AddComplaintDto dto);
        Task<ComplaintDto> UpdateComplaintStatusAsync(int id, ComplaintStatus status, string adminNotes);
        Task<bool> NotifyComplaintAsync(int complaintId);

        // User management
        Task<List<UserAccountDto>> GetAllUsersAsync();
        Task<bool> ToggleUserActiveAsync(string userId);
        Task<bool> SuspendLandlordAsync(SuspendLandlordDto dto);

        // Reports
        Task<AccommodationReportDto> GetAccommodationReportAsync();
    }
}
