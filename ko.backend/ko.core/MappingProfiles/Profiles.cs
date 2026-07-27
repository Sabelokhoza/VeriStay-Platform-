using ko.core.Models;
using ko.entity_framework.entities;
using AutoMapper;

namespace ko.core.MappingProfiles
{

    public class PropertyMappingProfile : Profile
    {
        public PropertyMappingProfile()
        {
            CreateMap<ListingDetailsDto, PropertyDto>().ReverseMap();
            CreateMap<Property, PropertyDto>().ReverseMap(); 
            CreateMap<ListingDto, PropertyDto>().ReverseMap();
            CreateMap<ListingDto, Property>().ReverseMap();
            CreateMap<Property, PropertyDto>().ReverseMap();
            CreateMap<Property, AddPropertyDto>().ReverseMap();
            CreateMap<Property, ListingDetailsDto>().ReverseMap();
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
            CreateMap<StudentApplication, ApplicationDto>().ReverseMap();
            CreateMap<Application, ApplicationDto>().ReverseMap();
            CreateMap<Application, StudentApplication>().ReverseMap();
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
            CreateMap<RentPayment, RentPaymentDto>()
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Tenancy.Student.FullName))
            .ForMember(dest => dest.StudentId, opt => opt.MapFrom(src => src.Tenancy.StudentId))
            .ForMember(dest => dest.PropertyTitle, opt => opt.MapFrom(src => src.Tenancy.Property.Title))
            .ForMember(dest => dest.PropertyLocation, opt => opt.MapFrom(src =>
                src.Tenancy.Property.Address + " - " + src.Tenancy.Property.City));

            CreateMap<AddRentPaymentDto, RentPayment>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(_ => PaymentStatus.Pending));

            CreateMap<RentPaymentDto, RentPayment>();
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
