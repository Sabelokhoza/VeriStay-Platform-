// =============================================
// authApi.ts — update register mutation
// =============================================

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../api/baseApi';

export const authApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: async (args, api, extraOptions) => {
        const customBaseQuery = baseQueryWithErrorHandling;
        return customBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (creds) => ({
                url: 'Auth/login',
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: creds,
            }),
        }),

        register: builder.mutation({
            query: ({ proofOfRegistration, proofOfIncome, ...registerDto }) => {
                const formData = new FormData();
                formData.append('proofOfRegistration', proofOfRegistration);
                formData.append('proofOfIncome', proofOfIncome);

                // Build query string from registerDto
                const params = new URLSearchParams();
                Object.entries(registerDto).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        params.append(key, String(value));
                    }
                });

                return {
                    url: `Auth/register?${params.toString()}`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),

        registerConsultant: builder.mutation({
            query: (creds) => ({
                url: 'Auth/addcentreadmin',
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: creds,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (data) => ({
                url: 'Auth/forgot-password',
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: data,
            }),
        }),

        resetPassword: builder.mutation({
            query: (data) => ({
                url: 'Auth/reset-password',
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: data,
            }),
        }),

        updateProfile: builder.mutation({
            query: (data) => ({
                url: 'Auth/update-profile',
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useUpdateProfileMutation,
    useRegisterConsultantMutation,
} = authApi;