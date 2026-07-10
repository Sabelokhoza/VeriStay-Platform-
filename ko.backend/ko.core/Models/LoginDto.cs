using ko.entity_framework.entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ko.core.Models
{
    public class EmailMessage
    {
        public EmailMessage(string to, string subject, string body)
        {
            To = to;
            Subject = subject;
            Body = body;
        }

        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }

    public class ResetPasswordRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; }
        [Required]
        public string Password { get; set; }
    }
    public class RequestForgotPasswordDto
    {
        [Required]
        public string Email { get; set; }
    }
    public class LoginDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
    // =============================================
    // PROPERTY DTOs
    // =============================================

    public class PropertyDto
    {
        public int Id { get; set; }
        public string LandlordId { get; set; }
        public string LandlordName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public decimal MonthlyRent { get; set; }
        public int AvailableBeds { get; set; }
        public bool IsAvailable { get; set; }
        public PropertyStatus Status { get; set; }
        public List<string> Amenities { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<PropertyImageDto> Images { get; set; }
    }

    public class ListingDto
    {
        public int Id { get; set; }
        public string LandlordId { get; set; }
        public string LandlordName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public decimal MonthlyRent { get; set; }
        public int AvailableBeds { get; set; }
        public bool IsAvailable { get; set; }
        public PropertyStatus Status { get; set; }
        public List<string> Amenities { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime CreatedAt { get; set; }
        public  PropertyImageDto Image { get; set; }
    }
    public class ListingDetailsDto
    {
        public int Id { get; set; }
        public string LandlordId { get; set; }
        public string LandlordName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public decimal MonthlyRent { get; set; }
        public int AvailableBeds { get; set; }
        public bool IsAvailable { get; set; }
        public PropertyStatus Status { get; set; }
        public List<string> Amenities { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<PropertyImageDto> Images { get; set; }
    }

    public class AddPropertyDto
    {
        [Required]
        public string LandlordId { get; set; }
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal MonthlyRent { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int AvailableBeds { get; set; }

        public List<string> Amenities { get; set; } = new();

        [Required]
        public DateTime AvailableFrom { get; set; }
    }

    public class PropertyImageDto
    {
        public int Id { get; set; }
        public int PropertyId { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
    }

    public class AddPropertyImageDto
    {
        [Required]
        public IFormFile image { get; set; }


        [Required]
        public int PropertyId { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        public bool IsPrimary { get; set; } = false;
    }


    // =============================================
    // VERIFICATION DOCUMENT DTOs
    // =============================================

    public class VerificationDocumentDto
    {
        public int Id { get; set; }
        public string LandlordId { get; set; }
        public string LandlordName { get; set; }
        public string DocumentUrl { get; set; }
        public string DocumentType { get; set; }
        public DocumentStatus Status { get; set; }
        public string AdminNotes { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class AddVerificationDocumentDto
    {
        [Required]
        public string DocumentUrl { get; set; }

        [Required]
        public string DocumentType { get; set; }
    }

    public class ReviewVerificationDocumentDto
    {
        [Required]
        public int DocumentId { get; set; }

        [Required]
        public DocumentStatus Status { get; set; }

        public string AdminNotes { get; set; }
    }


    // =============================================
    // APPLICATION DTOs
    // =============================================

    public class ApplicationDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }
        public ApplicationStatus Status { get; set; }
        public string SupportingDocumentUrl { get; set; }
        public string LandlordNotes { get; set; }
        public DateTime AppliedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
    }

    public class AddApplicationDto
    {
        [Required]
        public int PropertyId { get; set; }

        public string SupportingDocumentUrl { get; set; }
    }

    public class ReviewApplicationDto
    {
        [Required]
        public int ApplicationId { get; set; }

        [Required]
        public ApplicationStatus Status { get; set; }

        public string LandlordNotes { get; set; }
    }


    // =============================================
    // WAITING LIST DTOs
    // =============================================

    public class WaitingListEntryDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }
        public int Position { get; set; }
        public bool NotificationSent { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    public class AddWaitingListEntryDto
    {
        [Required]
        public int PropertyId { get; set; }
    }


    // =============================================
    // TENANCY DTOs
    // =============================================

    public class TenancyDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }
        public DateTime LeaseStartDate { get; set; }
        public DateTime LeaseEndDate { get; set; }
        public decimal MonthlyRent { get; set; }
        public TenancyStatus Status { get; set; }
    }

    public class AddTenancyDto
    {
        [Required]
        public string StudentId { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [Required]
        public DateTime LeaseStartDate { get; set; }

        [Required]
        public DateTime LeaseEndDate { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal MonthlyRent { get; set; }
    }


    // =============================================
    // LEASE DOCUMENT DTOs
    // =============================================

    public class LeaseDocumentDto
    {
        public int Id { get; set; }
        public int TenancyId { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }
        public string DocumentUrl { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class AddLeaseDocumentDto
    {
        [Required]
        public int TenancyId { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [Required]
        public string DocumentUrl { get; set; }
    }


    // =============================================
    // RENT PAYMENT DTOs
    // =============================================

    public class RentPaymentDto
    {
        public int Id { get; set; }
        public int TenancyId { get; set; }
        public string StudentName { get; set; }
        public string PropertyTitle { get; set; }
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidAt { get; set; }
        public PaymentStatus Status { get; set; }
        public string ReceiptUrl { get; set; }
    }

    public class AddRentPaymentDto
    {
        [Required]
        public int TenancyId { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime DueDate { get; set; }
    }

    public class MarkRentPaidDto
    {
        [Required]
        public int RentPaymentId { get; set; }

        public string ReceiptUrl { get; set; }
    }


    // =============================================
    // MAINTENANCE REQUEST DTOs
    // =============================================

    public class MaintenanceRequestDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public MaintenancePriority Priority { get; set; }
        public MaintenanceStatus Status { get; set; }
        public List<string> PhotoUrls { get; set; }
        public string LandlordResponse { get; set; }
        public DateTime SubmittedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public class AddMaintenanceRequestDto
    {
        [Required]
        public int PropertyId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public MaintenancePriority Priority { get; set; }

        public List<string> PhotoUrls { get; set; } = new();
    }

    public class UpdateMaintenanceRequestDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public MaintenanceStatus Status { get; set; }

        public string LandlordResponse { get; set; }
    }


    // =============================================
    // ANNOUNCEMENT DTOs
    // =============================================

    public class AnnouncementDto
    {
        public int Id { get; set; }
        public string LandlordId { get; set; }
        public string LandlordName { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }
        public string Message { get; set; }
        public DateTime PostedAt { get; set; }
    }

    public class AddAnnouncementDto
    {
        [Required]
        public int PropertyId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Message { get; set; }
    }


    // =============================================
    // REVIEW DTOs
    // =============================================

    public class ReviewDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public string LandlordId { get; set; }
        public string LandlordName { get; set; }
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AddReviewDto
    {
        [Required]
        public string LandlordId { get; set; }

        [Required]
        public int PropertyId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }
    }


    // =============================================
    // DISPUTE DTOs
    // =============================================

    public class DisputeDto
    {
        public int Id { get; set; }
        public string StudentId { get; set; }
        public string StudentName { get; set; }
        public string LandlordId { get; set; }
        public string LandlordName { get; set; }
        public string Description { get; set; }
        public DisputeStatus Status { get; set; }
        public string AdminResolutionNotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public class AddDisputeDto
    {
        [Required]
        public string LandlordId { get; set; }

        [Required]
        [StringLength(2000)]
        public string Description { get; set; }
    }

    public class ResolveDisputeDto
    {
        [Required]
        public int DisputeId { get; set; }

        [Required]
        public DisputeStatus Status { get; set; }

        [Required]
        public string AdminResolutionNotes { get; set; }
    }


    // =============================================
    // LANDLORD PROFILE DTOs
    // =============================================

    public class LandlordDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public VerificationStatus VerificationStatus { get; set; }
        public double ReputationScore { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class RegisterLandlordDto
    {
        [Required]
        [Display(Name = "Full Name")]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        [Display(Name = "Confirm Password")]
        public string ConfirmPassword { get; set; }
    }


    // =============================================
    // STUDENT PROFILE DTOs
    // =============================================

    public class StudentDto
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string StudentNumber { get; set; }
        public string University { get; set; }
        public decimal Budget { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class JwtSettings
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int DurationInMinutes { get; set; }
    }
}
