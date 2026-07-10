import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../api/baseApi';

export interface AddPaymentDto {
    paymentMethod: string;
    amount: number;
    applicationUserId: string;
    courseEnrollmentId: number;
}

export interface PaymentDto {
    id: number;
    userId: string;
    enrollmentId: number;
    amount: number;
    paymentMethod?: string;
    transactionReference?: string;
    paymentDate: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export const filesApi = createApi({
    reducerPath: 'filesApi',
    baseQuery: async (args, api, extraOptions) => {
        const customBaseQuery = baseQueryWithErrorHandling;
        return customBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({
        getSignedUrl: builder.query<string, string>({
            query: (filePath) => ({
                url: `Files/get-signed-url?filePath=${encodeURIComponent(filePath)}`,
                method: 'GET',
                responseHandler: (response: { text: () => any }) => response.text(),
            }),
        }),
        addPayment: builder.mutation<PaymentDto, AddPaymentDto>({
            query: (paymentDto) => ({
                url: 'Payment/add',
                method: 'POST',
                body: paymentDto,
            }),
        }),
    }),
});

export const { useGetSignedUrlQuery, useLazyGetSignedUrlQuery, useAddPaymentMutation } = filesApi ;
