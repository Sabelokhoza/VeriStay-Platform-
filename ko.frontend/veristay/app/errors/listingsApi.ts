import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../api/baseApi';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ListingImageDto {
    id: number;
    propertyId: number;
    imageUrl: string;
    isPrimary: boolean;
}
export interface HousemateDto {
    id: string;
    fullName: string;
    email: string;
    studentNumber: string;
    university: string;
    phoneNumber: string;
    budget: number;
}

export interface PropertyInfoDto {
    id:            number;
    landlordId:    string;
    landlordName:  string | null;
    title:         string;
    description:   string;
    address:       string;
    city:          string;
    monthlyRent:   number;
    availableBeds: number;
    isAvailable:   boolean;
    status:        number;
    amenities:     string[];
    availableFrom: string;
    createdAt:     string;
    image:         ListingImageDto | null;
}

export interface UpdatePropertyDto {
    id: number;
    landlordId: string;
    title: string;
    description: string;
    address: string;
    city: string;
    monthlyRent: number;
    availableBeds: number;
    amenities: string[];
    availableFrom: string;
    isAvailable: boolean;
}

export enum MaintenancePriority {
    Low = 0,
    Medium = 1,
    High = 2,
    Emergency = 3,
}

export enum MaintenanceStatus {
    Open = 0,
    InProgress = 1,
    Resolved = 2,
    Rejected = 3,
}

export interface MaintenanceRequestDto {
    id: number;
    studentId: string;
    studentName: string | null;
    propertyId: number;
    propertyTitle: string | null;
    title: string;
    description: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    photoUrls: string[];
    landlordResponse: string;
    submittedAt: string;
    resolvedAt: string | null;
}
export interface AddApplicationDto {
    studentId: string;
    propertyId: number;
    supportingDocumentUrl?: string;
}

export interface ApplicationResponseDto {
    id: number;
    studentId: string;
    propertyId: number;
    status: number;
    appliedAt: string;
}

export interface ListingDto {
    id: number;
    landlordId: string;
    landlordName: string | null;
    title: string;
    description: string;
    address: string;
    city: string;
    monthlyRent: number;
    availableBeds: number;
    isAvailable: boolean;
    status: number;
    amenities: string[];
    availableFrom: string;
    createdAt: string;
    image: ListingImageDto | null;
}

// Details endpoint returns the *full* image collection (not just a single
// cover image), so it gets its own DTO rather than reusing ListingDto.
export interface ListingDetailsDto {
    id: number;
    landlordId: string;
    landlordName: string | null;
    landLordEmail: string | null;
    landLordPhoneNumber: string | null;
    title: string;
    description: string;
    address: string;
    city: string;
    monthlyRent: number;
    availableBeds: number;
    isAvailable: boolean;
    status: number;
    amenities: string[];
    availableFrom: string;
    createdAt: string;
    images: ListingImageDto[];
}
export interface TenancyDto {
    id: number;
    studentId: string;
    studentName: string;
    landlordName: string;
    location: string;
    propertyId: number;
    propertyTitle: string;
    leaseStartDate: string;
    leaseEndDate: string;
    monthlyRent: number;
    status: number; // 0=Active, 1=Ended, 2=Terminated
}
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
    details: string | null;
    traceId: string | null;
    timestamp: string;
}

export interface StudentDto {
    id: string;
    fullName: string;
    email: string;
    studentNumber: string;
    university: string;
    phoneNumber: string;
    budget: number;
}

export interface ApplicationDto {
    id: number;
    studentId: string;
    studentName: string | null;
    propertyId: number;
    propertyTitle: string;
    propertyDescription: string;
    propertyLocation: string;
    price: number;
    status: number; // 0=Pending, 1=Approved, 2=Rejected
    supportingDocumentUrl: string;
    landlordNotes: string;
    landlordName: string;
    appliedAt: string;
    reviewedAt: string | null;
}

export interface AnnouncementDto {
    id: number;
    landlordId: string;
    landlordName: string;
    propertyId: number;
    propertyTitle: string;
    message: string;
    postedAt: string;
}

export interface LandlordProfileDto {
    id:          string;
    fullName:    string;
    email:       string;
    phoneNumber: string;
    budget:      number;
}

export interface LandlordPropertyDto {
    id:            number;
    landlordId:    string;
    landlordName:  string | null;
    title:         string;
    description:   string;
    address:       string;
    city:          string;
    monthlyRent:   number;
    availableBeds: number;
    isAvailable:   boolean;
    status:        number;
    amenities:     string[];
    availableFrom: string;
    createdAt:     string;
    images:        ListingImageDto[];
}

export interface LandlordMaintenanceDto {
    id:               number;
    studentId:        string;
    studentName:      string | null;
    propertyId:       number;
    propertyTitle:    string;
    title:            string;
    description:      string;
    priority:         number; // 0=Low, 1=Medium, 2=High, 3=Emergency
    status:           number; // 0=Open, 1=InProgress, 2=Resolved
    photoUrls:        string[];
    landlordResponse: string;
    submittedAt:      string;
    resolvedAt:       string | null;
}
export interface StudentDashboardDataDto {
    student: StudentDto;
    applicationsCount: number;
    approvedCount: number;
    paymentsCount: number;
    requestsCount: number;
    applications: ApplicationDto[];
    waitingList: ApplicationDto[];
    announcementDtos: AnnouncementDto[];
}

export interface AddMaintenanceRequestDto {
    propertyId: number;
    title: string;
    description: string;
    priority: MaintenancePriority;
}

export interface AddPropertyDto {
    landlordId:    string;
    title:         string;
    description:   string;
    address:       string;
    city:          string;
    monthlyRent:   number;
    availableBeds: number;
    amenities:     string[];
    availableFrom: string;
}

export interface LandlordDashboardDataDto {
    landlord:            LandlordProfileDto;
    applicationsCount:   number;
    propertiesCount:     number;
    tenantsCount:        number;
    requestsCount:       number;
    recentApplications:  ApplicationDto[];
    waitingList:         ApplicationDto[];
    propertiesDto:       LandlordPropertyDto[];
    openMantainances:    LandlordMaintenanceDto[];
}


// =============================================
// listingsApi.ts
// =============================================

export interface GetListingsParams {
    city?: string;
    title?: string;
    description?: string;
    address?: string;
}

export const listingsApi = createApi({
    reducerPath: 'listingsApi',
    baseQuery: async (args, api, extraOptions) => {
        const customBaseQuery = baseQueryWithErrorHandling;
        return customBaseQuery(args, api, extraOptions);
    },
    tagTypes: ['Listing'],
    endpoints: (builder) => ({
        getListings: builder.query<ListingDto[], GetListingsParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.city) queryParams.append('city', params.city);
                if (params?.title) queryParams.append('title', params.title);
                if (params?.description) queryParams.append('description', params.description);
                if (params?.address) queryParams.append('address', params.address);

                return {
                    url: `Property/get-listings?${queryParams.toString()}`,
                    method: 'GET',
                };
            },
            transformResponse: (response: ApiResponse<ListingDto[]>) => response.data,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: 'Listing' as const, id })),
                          { type: 'Listing' as const, id: 'LIST' },
                      ]
                    : [{ type: 'Listing' as const, id: 'LIST' }],
        }),
        applyForProperty: builder.mutation<ApiResponse<ApplicationResponseDto>, AddApplicationDto>({
            query: (body) => ({
                url: 'Application/apply',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Listing', id: 'LIST' }],
        }),
        getStudentDashboard: builder.query<StudentDashboardDataDto, string>({
            query: (userId) => ({
                url: `User/get-student-dashboarddata?user_id=${userId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<StudentDashboardDataDto>) => response.data,
            providesTags: (_result, _error, userId) => [
                { type: 'Listing' as const, id: `dashboard-${userId}` },
            ],
        }),
        getTenancyInfo: builder.query<TenancyDto, string>({
            query: (studentId) => ({
                url: `Tenancy/get-tenancy-info?studentId=${studentId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<TenancyDto>) => response.data,
            providesTags: (_result, _error, studentId) => [
                { type: 'Listing' as const, id: `tenancy-${studentId}` },
            ],
        }),
        getLandlordDashboard: builder.query<LandlordDashboardDataDto, string>({
            query: (userId) => ({
                url: `User/get-landlord-dashboarddata?user_id=${userId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<LandlordDashboardDataDto>) => response.data,
            providesTags: (_result, _error, userId) => [
                { type: 'Listing' as const, id: `landlord-dashboard-${userId}` },
            ],
        }),
        getHousemates: builder.query<HousemateDto[], string>({
            query: (userId) => ({
                url: `Tenancy/get-housemates?userId=${userId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<HousemateDto[]>) => response.data,
            providesTags: (_result, _error, userId) => [
                { type: 'Listing' as const, id: `housemates-${userId}` },
            ],
        }),
        getStudentMaintenanceRequests: builder.query<MaintenanceRequestDto[], string>({
            query: (studentId) => ({
                url: `MaintenanceRequest/student/${studentId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<MaintenanceRequestDto[]>) => response.data,
            providesTags: (_result, _error, studentId) => [
                { type: 'Listing' as const, id: `maintenance-${studentId}` },
            ],
        }),
        getTenanciesByStudentId: builder.query<TenancyDto[], string>({
            query: (studentId) => ({
                url: `Tenancy/student/${studentId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<TenancyDto[]>) => response.data,
            providesTags: (_result, _error, studentId) => [
                { type: 'Listing' as const, id: `tenancies-${studentId}` },
            ],
        }),
        addMaintenanceRequest: builder.mutation<
            MaintenanceRequestDto,
            { studentId: string; dto: AddMaintenanceRequestDto }
        >({
            query: ({ studentId, dto }) => ({
                url: `MaintenanceRequest/${studentId}`,
                method: 'POST',
                body: dto,
            }),
            transformResponse: (response: ApiResponse<MaintenanceRequestDto>) => response.data,
            invalidatesTags: (_result, _error, { studentId }) => [
                { type: 'Listing' as const, id: `maintenance-${studentId}` },
            ],
        }),
        addProperty: builder.mutation<LandlordPropertyDto, AddPropertyDto>({
            query: (body) => ({
                url: 'Property',
                method: 'POST',
                body,
            }),
            transformResponse: (response: ApiResponse<LandlordPropertyDto>) => response.data,
            invalidatesTags: (_result, _error, dto) => [
                { type: 'Listing' as const, id: `landlord-dashboard-${dto.landlordId}` },
                { type: 'Listing' as const, id: 'LIST' },
            ],
        }),
        getListingById: builder.query<ListingDetailsDto, number>({
            query: (propertyId) => ({
                url: `Property/get-listing-by-details-id?propertyId=${propertyId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<ListingDetailsDto>) => response.data,
            providesTags: (result, error, propertyId) => [
                { type: 'Listing' as const, id: propertyId },
            ],
        }),
        getPropertyInfo: builder.query<PropertyInfoDto, number>({
            query: (propertyId) => ({
                url: `Property/get-property-info?propertyId=${propertyId}`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<PropertyInfoDto>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'Listing' as const, id }],
        }),

       updateProperty: builder.mutation<boolean, UpdatePropertyDto>({
            query: (property) => ({
                url: `Property/update-propery/${property.id}`,
                method: 'PUT',
                body: property,
            }),
            transformResponse: (response: ApiResponse<boolean>) => response.data,
            invalidatesTags: (_result, _error, property) => [
                { type: 'Listing', id: property.id },
                { type: 'Listing', id: 'LIST' },
            ],
        }),
        deletePropertyImage: builder.mutation<ApiResponse<boolean>, number>({
            query: (imageId) => ({
                url: `Property/images/${imageId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Listing' as const, id: 'LIST' }],
        }),
        getImagesByPropertyId: builder.query<ListingImageDto[], number>({
    query: (propertyId) => ({
        url: `Property/${propertyId}/images`,
        method: 'GET',
    }),
    transformResponse: (response: ApiResponse<ListingImageDto[]>) => response.data,
    providesTags: (_result, _error, propertyId) => [
        { type: 'Listing' as const, id: propertyId },
    ],
}),

       addPropertyImage: builder.mutation<
    ListingImageDto,
    {
        propertyId: number;
        image: File;
        isPrimary: boolean;
    }
        >({
            query: ({ propertyId, image, isPrimary }) => {
                const formData = new FormData();
                formData.append("image", image);

                return {
                    url: `Property/add-image?propertyId=${propertyId}&isPrimary=${isPrimary}`,
                    method: "POST",
                    body: formData,
                };
            },
            transformResponse: (response: ApiResponse<ListingImageDto>) => response.data,
            invalidatesTags: (_result, _error, { propertyId }) => [
                { type: "Listing", id: propertyId },
                { type: "Listing", id: "LIST" },
            ],
        }),
        setPrimaryImage: builder.mutation<ApiResponse<boolean>, number>({
            query: (imageId) => ({
                url: `Property/images/${imageId}/set-primary`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'Listing' as const, id: 'LIST' }],
        }),
            }),
        });

export const {
    useGetListingsQuery,
    useLazyGetListingsQuery,
    useGetListingByIdQuery,
    useLazyGetListingByIdQuery,
    useAddPropertyImageMutation,
useGetImagesByPropertyIdQuery,
    useGetStudentDashboardQuery,
    useGetHousematesQuery,
    useGetStudentMaintenanceRequestsQuery,
    useGetTenancyInfoQuery,
    useApplyForPropertyMutation,
    useGetTenanciesByStudentIdQuery,
    useGetLandlordDashboardQuery,
    useAddMaintenanceRequestMutation,
    useAddPropertyMutation,
     useGetPropertyInfoQuery,
    useUpdatePropertyMutation,
    useDeletePropertyImageMutation,
    useSetPrimaryImageMutation,
} = listingsApi;