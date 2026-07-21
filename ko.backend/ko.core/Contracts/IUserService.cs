using ko.core.Models;

namespace ko.core.Contracts
{
    public interface IUserService
    {
        Task<ProfileDto> GetUser(string userId);
        Task<bool> UpdateLandLordStatus(string userId, bool isApproved = false);
        Task<StudentDashboardDataDto> GetStudentDashboardData(string userId);
        Task<LandlordDashboardDataDto> GetLandlordDashboardData(string userId);

    }
}
