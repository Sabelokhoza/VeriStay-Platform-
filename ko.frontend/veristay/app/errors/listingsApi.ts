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

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
    details: string | null;
    traceId: string | null;
    timestamp: string;
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
    }),
});

export const {
    useGetListingsQuery,
    useLazyGetListingsQuery,
    useGetListingByIdQuery,
    useLazyGetListingByIdQuery,
} = listingsApi;
