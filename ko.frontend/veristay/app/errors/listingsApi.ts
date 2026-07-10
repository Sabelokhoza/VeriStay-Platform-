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

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
    details: string | null;
    traceId: string | null;
    timestamp: string;
}

export interface GetListingsParams {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
}

// ---------------------------------------------------------------------------
// API slice
// ---------------------------------------------------------------------------

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
               
                return {
                    url: `Property/get-listings`,
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

        getListingById: builder.query<ListingDto, number>({
            query: (id) => ({
                url: `Property/get-listings`,
                method: 'GET',
            }),
            transformResponse: (response: ApiResponse<ListingDto>) => response.data,
            providesTags: (_result, _error, id) => [{ type: 'Listing', id }],
        }),
    }),
});

export const { useGetListingsQuery, useLazyGetListingsQuery, useGetListingByIdQuery } = listingsApi;