using ko.core.Models;

namespace ko.core.Contracts
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(LoginDto loginDto);
        Task<RegistrationResponse> RegisterStudentAsync(RegisterStudentDto registerDto);
        Task<bool> ForgotPassword(RequestForgotPasswordDto model);
        Task<bool> ResetPassword(ResetPasswordRequestDto model);
        Task<RegistrationResponse> RegisterLandLordAsync(RegisterLandlordDto registerDto);

    }

    public interface IUserService
    {
        Task<ProfileDto> GetUser(string userId);
        Task<bool> UpdateLandLordStatus(string userId, bool isApproved = false);

    }
    // =============================================
    // IPropertyService
    // =============================================

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
    }


    // =============================================
    // IPropertyImageService
    // =============================================

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
        // Events
        Task<bool> onInsert(AddApplicationDto dto);
        Task<bool> afterInsert(ApplicationDto dto);
        Task<bool> onUpdate(ApplicationDto dto);
        Task<bool> afterUpdate(ApplicationDto dto);
        Task<bool> onDelete(ApplicationDto dto);
        Task<bool> afterDelete(ApplicationDto dto);
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
    // ITenancyService
    // =============================================

    public interface ITenancyService
    {
        Task<TenancyDto?> AddAsync(AddTenancyDto dto);
        Task<List<TenancyDto>> GetAllAsync();
        Task<TenancyDto?> GetByIdAsync(int? id);
        Task<List<TenancyDto>> GetByStudentIdAsync(string studentId);
        Task<List<TenancyDto>> GetByPropertyIdAsync(int propertyId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> UpdateAsync(int id, TenancyDto dto);
        Task<bool> EndTenancyAsync(int id);
        // Events
        Task<bool> onInsert(AddTenancyDto dto);
        Task<bool> afterInsert(TenancyDto dto);
        Task<bool> onUpdate(TenancyDto dto);
        Task<bool> afterUpdate(TenancyDto dto);
        Task<bool> onDelete(TenancyDto dto);
        Task<bool> afterDelete(TenancyDto dto);
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
        Task<RentPaymentDto?> AddAsync(AddRentPaymentDto dto);
        Task<List<RentPaymentDto>> GetAllAsync();
        Task<RentPaymentDto?> GetByIdAsync(int? id);
        Task<List<RentPaymentDto>> GetByTenancyIdAsync(int tenancyId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> MarkAsPaidAsync(MarkRentPaidDto dto);
        Task<List<RentPaymentDto>> GetOverdueAsync();
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
        Task<MaintenanceRequestDto?> GetByIdAsync(int? id);
        Task<List<MaintenanceRequestDto>> GetByPropertyIdAsync(int propertyId);
        Task<List<MaintenanceRequestDto>> GetByStudentIdAsync(string studentId);
        Task<bool> DeleteAsync(int? id);
        Task<bool> UpdateAsync(UpdateMaintenanceRequestDto dto);
        Task<bool> ResolveAsync(int id, string landlordResponse);
        // Events
        Task<bool> onInsert(AddMaintenanceRequestDto dto);
        Task<bool> afterInsert(MaintenanceRequestDto dto);
        Task<bool> onUpdate(MaintenanceRequestDto dto);
        Task<bool> afterUpdate(MaintenanceRequestDto dto);
        Task<bool> onDelete(MaintenanceRequestDto dto);
        Task<bool> afterDelete(MaintenanceRequestDto dto);
    }


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
        // Events
        Task<bool> onInsert(AddAnnouncementDto dto);
        Task<bool> afterInsert(AnnouncementDto dto);
        Task<bool> onUpdate(AnnouncementDto dto);
        Task<bool> afterUpdate(AnnouncementDto dto);
        Task<bool> onDelete(AnnouncementDto dto);
        Task<bool> afterDelete(AnnouncementDto dto);
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
        Task<double> GetAverageRatingAsync(string landlordId);
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
