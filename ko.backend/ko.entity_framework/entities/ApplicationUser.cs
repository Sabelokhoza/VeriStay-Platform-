using Microsoft.AspNetCore.Identity;

namespace ko.entity_framework.entities
{

    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string StudentNumber { get; set; } = string.Empty;
        public string University { get; set; } = "University Of The Freestate";
        public string PhoneNumber { get; set; } = string.Empty;
        public string ProofOfRegistrationUrl { get; set; } = string.Empty;
        public string ProofOfIncomeUrl { get; set; } = string.Empty;
        public decimal Budget { get; set; } = 0;

        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;
        public double ReputationScore { get; set; } = 0.0;

        public List<VerificationDocument> Documents { get; set; } = new();
        public List<Property> Properties { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
        public List<Announcement> Announcements { get; set; } = new();

    }

    public static class AppRoles
    {
        public const string Admin = "Admin";
        public const string Landlord = "Landlord";
        public const string Student = "Student";
    }



    public class Student : ApplicationUser
    {
        public string StudentNumber { get; set; }
        public string University { get; set; }
        public decimal Budget { get; set; }

        public List<Application> Applications { get; set; } = new();
        public List<WaitingListEntry> WaitingListEntries { get; set; } = new();
        public List<MaintenanceRequest> MaintenanceRequests { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
    }



    public class Landlord : ApplicationUser
    {
        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.Pending;
        public double ReputationScore { get; set; } = 0.0;

        public List<VerificationDocument> Documents { get; set; } = new();
        public List<Property> Properties { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
        public List<Announcement> Announcements { get; set; } = new();
    }

    public enum VerificationStatus { Pending, Approved, Rejected, Suspended }



    public class VerificationDocument : BaseEntity
    {
        public string LandlordId { get; set; }
        public Landlord Landlord { get; set; }
        public string DocumentUrl { get; set; }
        public string DocumentType { get; set; }
        public DocumentStatus Status { get; set; } = DocumentStatus.Pending;
        public string AdminNotes { get; set; }
    }

    public enum DocumentStatus { Pending, Approved, Rejected }



    public class Property : BaseEntity
    {
        public string LandlordId { get; set; }
        public Landlord Landlord { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public decimal MonthlyRent { get; set; }
        public int AvailableBeds { get; set; }
        public bool IsAvailable { get; set; } = true;
        public PropertyStatus Status { get; set; } = PropertyStatus.PendingApproval;
        public List<string> Amenities { get; set; } = new();
        public DateTime AvailableFrom { get; set; }

        public List<PropertyImage> Images { get; set; } = new();
        public List<Application> Applications { get; set; } = new();
        public List<WaitingListEntry> WaitingList { get; set; } = new();
        public List<LeaseDocument> LeaseDocuments { get; set; } = new();
        public List<MaintenanceRequest> MaintenanceRequests { get; set; } = new();
        public List<Announcement> Announcements { get; set; } = new();
        public List<Review> Reviews { get; set; } = new();
    }

    public enum PropertyStatus { PendingApproval, Approved, Rejected, Delisted }

    public class PropertyImage : BaseEntity
    {
        public int PropertyId { get; set; }
        public Property Property { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; } = false;
    }



    public class Application : BaseEntity
    {
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public int PropertyId { get; set; }  
        public Property Property { get; set; }
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
        public string SupportingDocumentUrl { get; set; } = string.Empty;
        public string LandlordNotes { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
    }

    public enum ApplicationStatus { Pending, Approved, Rejected , WaitingList , Accepted , Declined }

    public class WaitingListEntry : BaseEntity
    {
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }
        public int Position { get; set; }
        public bool NotificationSent { get; set; } = false;
    }


    public class Tenancy : BaseEntity
    {
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }
        public DateTime LeaseStartDate { get; set; }
        public DateTime LeaseEndDate { get; set; }
        public decimal MonthlyRent { get; set; }
        public TenancyStatus Status { get; set; } = TenancyStatus.Active;

        public List<RentPayment> RentPayments { get; set; } = new();
        public List<LeaseDocument> LeaseDocuments { get; set; } = new();
    }

    public enum TenancyStatus { Active, Ended, Terminated }

    public class LeaseDocument : BaseEntity
    {
        public int TenancyId { get; set; }
        public Tenancy Tenancy { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }
        public string DocumentUrl { get; set; }
    }



    public class RentPayment : BaseEntity
    {
        public int TenancyId { get; set; }
        public Tenancy Tenancy { get; set; }
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? PaidAt { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public string ReceiptUrl { get; set; }
    }

    public enum PaymentStatus { Pending, Paid, Overdue }



    public class MaintenanceRequest : BaseEntity
    {
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public MaintenancePriority Priority { get; set; } = MaintenancePriority.Low;
        public MaintenanceStatus Status { get; set; } = MaintenanceStatus.Open;
        public List<string> PhotoUrls { get; set; } = new();
        public string LandlordResponse { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }
    }

    public enum MaintenancePriority { Low, Medium, High, Emergency }
    public enum MaintenanceStatus { Open, InProgress, Resolved }



    public class Announcement : BaseEntity
    {
        public string LandlordId { get; set; }
        public Landlord Landlord { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }
        public string Message { get; set; }
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    }

    public class Review : BaseEntity
    {
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public string LandlordId { get; set; }
        public Landlord Landlord { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Dispute : BaseEntity
    {
        public string StudentId { get; set; }
        public Student Student { get; set; }
        public string LandlordId { get; set; }
        public Landlord Landlord { get; set; }
        public string Description { get; set; }
        public DisputeStatus Status { get; set; } = DisputeStatus.Open;
        public string AdminResolutionNotes { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public enum DisputeStatus { Open, UnderReview, Resolved, Closed }

    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
    }
}
