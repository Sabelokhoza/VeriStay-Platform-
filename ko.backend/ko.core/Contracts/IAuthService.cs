using ko.core.Models;
using Microsoft.AspNetCore.Http;

namespace ko.core.Contracts
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(LoginDto loginDto);
        Task<RegistrationResponse> RegisterStudentAsync(IFormFile proofOfIncome, IFormFile proofOfRegistration , RegisterStudentDto registerDto);
        Task<bool> ForgotPassword(RequestForgotPasswordDto model);
        Task<bool> ResetPassword(ResetPasswordRequestDto model);
        Task<RegistrationResponse> RegisterLandLordAsync(IFormFile identificationDocument,  RegisterLandlordDto registerDto);

    }

    public interface INotificationService
    {
        Task SendToUserAsync(string userId, string title,
                             string message, string type);

        Task SendToTopicAsync(string topic, string title,
                              string message, string type);

        Task<List<AppNotificationDto>> GetUserNotificationsAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId);
        Task<bool> MarkAsReadAsync(int notificationId);
        Task<bool> MarkAllReadAsync(string userId);
        Task<bool> DeleteAsync(int notificationId);
        Task<bool> DeleteAllAsync(string userId);
    }

    public interface IPropertyImageService
    {
        Task<PropertyImageDto?> AddAsync(AddPropertyImageDto dto);
        Task<List<PropertyImageDto>> GetByPropertyIdAsync(int propertyId);
        Task<PropertyImageDto?> GetByIdAsync(int? id);
        Task<bool> DeleteAsync(int? id);
        Task<bool> SetPrimaryAsync(int imageId);
        // Events
        Task<bool> onInsert(AddPropertyImageDto dto);
        Task<bool> afterInsert(PropertyImageDto dto);
        Task<bool> onDelete(PropertyImageDto dto);
        Task<bool> afterDelete(PropertyImageDto dto);
    }


    // =============================================
    // IVerificationDocumentService
    // =============================================

    public interface IVerificationDocumentService
    {
        Task<VerificationDocumentDto?> AddAsync(string landlordId, AddVerificationDocumentDto dto);
        Task<List<VerificationDocumentDto>> GetAllAsync();
        Task<VerificationDocumentDto?> GetByIdAsync(int? id);
        Task<List<VerificationDocumentDto>> GetByLandlordIdAsync(string landlordId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> ReviewAsync(ReviewVerificationDocumentDto dto);
        // Events
        Task<bool> onInsert(AddVerificationDocumentDto dto);
        Task<bool> afterInsert(VerificationDocumentDto dto);
        Task<bool> onUpdate(VerificationDocumentDto dto);
        Task<bool> afterUpdate(VerificationDocumentDto dto);
        Task<bool> onDelete(VerificationDocumentDto dto);
        Task<bool> afterDelete(VerificationDocumentDto dto);
    }


    // =============================================
    // IWaitingListService
    // =============================================

    public interface IWaitingListService
    {
        Task<WaitingListEntryDto?> AddAsync(string studentId, AddWaitingListEntryDto dto);
        Task<List<WaitingListEntryDto>> GetAllAsync();
        Task<WaitingListEntryDto?> GetByIdAsync(int? id);
        Task<List<WaitingListEntryDto>> GetByPropertyIdAsync(int propertyId);
        Task<List<WaitingListEntryDto>> GetByStudentIdAsync(string studentId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> NotifyNextAsync(int propertyId);
        // Events
        Task<bool> onInsert(AddWaitingListEntryDto dto);
        Task<bool> afterInsert(WaitingListEntryDto dto);
        Task<bool> onDelete(WaitingListEntryDto dto);
        Task<bool> afterDelete(WaitingListEntryDto dto);
    }


    // =============================================
    // ILeaseDocumentService
    // =============================================

    public interface ILeaseDocumentService
    {
        Task<LeaseDocumentDto?> AddAsync(AddLeaseDocumentDto dto);
        Task<List<LeaseDocumentDto>> GetAllAsync();
        Task<LeaseDocumentDto?> GetByIdAsync(int? id);
        Task<List<LeaseDocumentDto>> GetByTenancyIdAsync(int tenancyId);
        Task<List<LeaseDocumentDto>> GetByStudentIdAsync(string studentId);
        Task<bool> DeleteAsync(int? id);
        // Events
        Task<bool> onInsert(AddLeaseDocumentDto dto);
        Task<bool> afterInsert(LeaseDocumentDto dto);
        Task<bool> onDelete(LeaseDocumentDto dto);
        Task<bool> afterDelete(LeaseDocumentDto dto);
    }


    // =============================================
    // IRentPaymentService
    // =============================================

    public interface IRentPaymentService
    {
        // Student
        Task<StudentPaymentSummaryDto> GetStudentPaymentSummaryAsync(string studentId);
        Task<List<RentPaymentDto>> GetByTenancyIdAsync(int tenancyId);
        Task<RentPaymentDto?> GetByIdAsync(int? id);

        // Landlord / Admin
        Task<RentPaymentDto?> AddAsync(AddRentPaymentDto dto);
        Task<bool> DeleteAsync(int? id);
        Task<List<RentPaymentDto>> GetOverdueAsync();
        Task<List<RentPaymentDto>> GetAllAsync();
        Task<LandlordPaymentsOverviewDto> GetLandlordPaymentsOverviewAsync(string landlordId);
        Task<bool> SendPaymentReminderAsync(SendReminderDto dto);

        // Mark paid
        Task<RentPaymentDto> MarkAsPaidAsync(MarkRentPaidDto dto);

        // Events
        Task<bool> onInsert(AddRentPaymentDto dto);
        Task<bool> afterInsert(RentPaymentDto dto);
        Task<bool> onUpdate(RentPaymentDto dto);
        Task<bool> afterUpdate(RentPaymentDto dto);
        Task<bool> onDelete(RentPaymentDto dto);
        Task<bool> afterDelete(RentPaymentDto dto);
    }


    // =============================================
    // IMaintenanceRequestService
    // =============================================

    public interface IMaintenanceRequestService
    {
        Task<MaintenanceRequestDto?> AddAsync(string studentId, AddMaintenanceRequestDto dto);
        Task<List<MaintenanceRequestDto>> GetAllAsync();
        Task<bool> MarkAsResolvedAsync(UpdateMaintenanceRequestDto updateMaintenanceRequestDto);
        Task<MaintenanceRequestDto?> GetByIdAsync(int? id);
        Task<List<MaintenanceRequestDto>> GetByPropertyIdAsync(int propertyId);
        Task<List<MaintenanceRequestDto>> GetOpenMantainanceByPropertiesAsync(List<PropertyDto> properties);
        Task<List<MaintenanceRequestDto>> GetMantainanceByPropertiesAsync(List<PropertyDto> properties);
        Task<List<MaintenanceRequestDto>> GetByStudentIdAsync(string studentId);
        Task<bool> DeleteAsync(int? id);
        // Events
        Task<bool> onInsert(AddMaintenanceRequestDto dto);
        Task<bool> afterInsert(MaintenanceRequestDto dto);
        Task<bool> onUpdate(MaintenanceRequestDto dto);
        Task<bool> afterUpdate(MaintenanceRequestDto dto);
        Task<bool> onDelete(MaintenanceRequestDto dto);
        Task<bool> afterDelete(MaintenanceRequestDto dto);
    }


    // =============================================
    // IReviewService
    // =============================================

    public interface IReviewService
    {
        Task<ReviewDto?> AddAsync(string studentId, AddReviewDto dto);
        Task<List<ReviewDto>> GetAllAsync();
        Task<ReviewDto?> GetByIdAsync(int? id);
        Task<List<ReviewDto>> GetByLandlordIdAsync(string landlordId);
        Task<List<ReviewDto>> GetByPropertyIdAsync(int propertyId);
        Task<double> GetAverageRatingByLandlordIdAsync(string landlordId);
        Task<double> GetAverageRatingAsync(int propertyId);
        Task<bool> DeleteAsync(int? id);
        // Events
        Task<bool> onInsert(AddReviewDto dto);
        Task<bool> afterInsert(ReviewDto dto);
        Task<bool> onDelete(ReviewDto dto);
        Task<bool> afterDelete(ReviewDto dto);
    }


    // =============================================
    // IDisputeService
    // =============================================

    public interface IDisputeService
    {
        Task<DisputeDto?> AddAsync(string studentId, AddDisputeDto dto);
        Task<List<DisputeDto>> GetAllAsync();
        Task<DisputeDto?> GetByIdAsync(int? id);
        Task<List<DisputeDto>> GetByStudentIdAsync(string studentId);
        Task<List<DisputeDto>> GetByLandlordIdAsync(string landlordId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> ResolveAsync(ResolveDisputeDto dto);
        // Events
        Task<bool> onInsert(AddDisputeDto dto);
        Task<bool> afterInsert(DisputeDto dto);
        Task<bool> onUpdate(DisputeDto dto);
        Task<bool> afterUpdate(DisputeDto dto);
        Task<bool> onDelete(DisputeDto dto);
        Task<bool> afterDelete(DisputeDto dto);
    }


    // =============================================
    // ILandlordService
    // =============================================

    public interface ILandlordService
    {
        Task<LandlordDto?> RegisterAsync(RegisterLandlordDto dto);
        Task<List<LandlordDto>> GetAllAsync();
        Task<LandlordDto?> GetByIdAsync(string? id);
        Task<bool> DeleteAsync(string? id);
        Task<bool> UpdateAsync(string id, LandlordDto dto);
        Task<bool> SuspendAsync(string id);
        Task<bool> ApproveAsync(string id);
        // Events
        Task<bool> onInsert(RegisterLandlordDto dto);
        Task<bool> afterInsert(LandlordDto dto);
        Task<bool> onUpdate(LandlordDto dto);
        Task<bool> afterUpdate(LandlordDto dto);
        Task<bool> onDelete(LandlordDto dto);
        Task<bool> afterDelete(LandlordDto dto);
    }


    // =============================================
    // IStudentService
    // =============================================

    public interface IStudentService
    {
        Task<StudentDto?> RegisterAsync(RegisterStudentDto dto);
        Task<List<StudentDto>> GetAllAsync();
        Task<StudentDto?> GetByIdAsync(string? id);
        Task<bool> DeleteAsync(string? id);
        Task<bool> UpdateAsync(string id, StudentDto dto);
        Task<bool> SuspendAsync(string id);
        // Events
        Task<bool> onInsert(RegisterStudentDto dto);
        Task<bool> afterInsert(StudentDto dto);
        Task<bool> onUpdate(StudentDto dto);
        Task<bool> afterUpdate(StudentDto dto);
        Task<bool> onDelete(StudentDto dto);
        Task<bool> afterDelete(StudentDto dto);
    }
}
