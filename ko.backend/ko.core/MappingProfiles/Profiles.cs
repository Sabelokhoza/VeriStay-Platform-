using ko.core.Models;
using ko.entity_framework.entities;
using AutoMapper;

namespace ko.core.MappingProfiles
{

    public class PropertyMappingProfile : Profile
    {
        public PropertyMappingProfile()
        {
            CreateMap<Property, PropertyDto>().ReverseMap();
            CreateMap<Property, AddPropertyDto>().ReverseMap();
            CreateMap<PropertyImage, PropertyImageDto>().ReverseMap();
            CreateMap<PropertyImage, AddPropertyImageDto>().ReverseMap();
        }
    }

    public class VerificationDocumentMappingProfile : Profile
    {
        public VerificationDocumentMappingProfile()
        {
            CreateMap<VerificationDocument, VerificationDocumentDto>().ReverseMap();
            CreateMap<VerificationDocument, AddVerificationDocumentDto>().ReverseMap();
            CreateMap<VerificationDocument, ReviewVerificationDocumentDto>().ReverseMap();
        }
    }

    public class ApplicationMappingProfile : Profile
    {
        public ApplicationMappingProfile()
        {
            CreateMap<Application, ApplicationDto>().ReverseMap();
            CreateMap<Application, AddApplicationDto>().ReverseMap();
            CreateMap<Application, ReviewApplicationDto>().ReverseMap();
        }
    }

    public class WaitingListMappingProfile : Profile
    {
        public WaitingListMappingProfile()
        {
            CreateMap<WaitingListEntry, WaitingListEntryDto>().ReverseMap();
            CreateMap<WaitingListEntry, AddWaitingListEntryDto>().ReverseMap();
        }
    }

    public class TenancyMappingProfile : Profile
    {
        public TenancyMappingProfile()
        {
            CreateMap<Tenancy, TenancyDto>().ReverseMap();
            CreateMap<Tenancy, AddTenancyDto>().ReverseMap();
        }
    }

    public class LeaseDocumentMappingProfile : Profile
    {
        public LeaseDocumentMappingProfile()
        {
            CreateMap<LeaseDocument, LeaseDocumentDto>().ReverseMap();
            CreateMap<LeaseDocument, AddLeaseDocumentDto>().ReverseMap();
        }
    }

    public class RentPaymentMappingProfile : Profile
    {
        public RentPaymentMappingProfile()
        {
            CreateMap<RentPayment, RentPaymentDto>().ReverseMap();
            CreateMap<RentPayment, AddRentPaymentDto>().ReverseMap();
            CreateMap<RentPayment, MarkRentPaidDto>().ReverseMap();
        }
    }

    public class MaintenanceRequestMappingProfile : Profile
    {
        public MaintenanceRequestMappingProfile()
        {
            CreateMap<MaintenanceRequest, MaintenanceRequestDto>().ReverseMap();
            CreateMap<MaintenanceRequest, AddMaintenanceRequestDto>().ReverseMap();
            CreateMap<MaintenanceRequest, UpdateMaintenanceRequestDto>().ReverseMap();
        }
    }

    public class AnnouncementMappingProfile : Profile
    {
        public AnnouncementMappingProfile()
        {
            CreateMap<Announcement, AnnouncementDto>().ReverseMap();
            CreateMap<Announcement, AddAnnouncementDto>().ReverseMap();
        }
    }

    public class ReviewMappingProfile : Profile
    {
        public ReviewMappingProfile()
        {
            CreateMap<Review, ReviewDto>().ReverseMap();
            CreateMap<Review, AddReviewDto>().ReverseMap();
        }
    }

    public class DisputeMappingProfile : Profile
    {
        public DisputeMappingProfile()
        {
            CreateMap<Dispute, DisputeDto>().ReverseMap();
            CreateMap<Dispute, AddDisputeDto>().ReverseMap();
            CreateMap<Dispute, ResolveDisputeDto>().ReverseMap();
        }
    }

    public class LandlordMappingProfile : Profile
    {
        public LandlordMappingProfile()
        {
            CreateMap<Landlord, LandlordDto>().ReverseMap();
            CreateMap<Landlord, RegisterLandlordDto>().ReverseMap();
        }
    }

    public class StudentMappingProfile : Profile
    {
        public StudentMappingProfile()
        {
            CreateMap<Student, StudentDto>().ReverseMap();
            CreateMap<Student, RegisterStudentDto>().ReverseMap();
            CreateMap<ApplicationUser, RegisterStudentDto>().ReverseMap();
            CreateMap<ApplicationUser, RegisterLandlordDto>().ReverseMap();
            CreateMap<ApplicationUser, ProfileDto>().ReverseMap();
        }
    }
}
