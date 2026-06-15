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
            query: (creds) => {
                return {
                    url: 'Auth/login',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: creds,
                };
            },
        }),
        registerConsultant: builder.mutation({
            query: (creds) => {
                return {
                    url: 'Auth/addcentreadmin',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: creds,
                };
            },
        }),
        register: builder.mutation({
            query: (creds) => {
                return {
                    url: 'Auth/register',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: creds,
                };
            },
        }),
        forgotPassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'Auth/forgot-password',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: data,
                };
            },
        }),
        resetPassword: builder.mutation({
            query: (data) => {
                return {
                    url: 'Auth/reset-password',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: data,
                };
            },
        }),
        updateProfile: builder.mutation({
            query: (data) => {
                return {
                    url: 'Auth/update-profile',
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: data,
                };
            },
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
