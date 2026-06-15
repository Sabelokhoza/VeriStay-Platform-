import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../api/baseApi';

export const errorApi = createApi({
    reducerPath: 'errorApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        ge400Error: builder.query<void, void>({
            query: () => ({ url: 'Buggy/bad-request' }),
        }),
        ge401Error: builder.query<void, void>({
            query: () => ({ url: 'Buggy/auth' }),
        }),
        ge500Error: builder.query<void, void>({
            query: () => ({ url: 'Buggy/server-error' }),
        }),
        getValidationError: builder.query<void, void>({
            query: () => ({ url: 'Error' }),
        }),
        get404Error: builder.query<void, void>({
            query: () => ({ url: 'Buggy/not-found' }),
        }),
    }),
});

export const {
    useLazyGe400ErrorQuery,
    useLazyGetValidationErrorQuery,
    useLazyGe401ErrorQuery,
    useLazyGe500ErrorQuery,
    useLazyGet404ErrorQuery,
} = errorApi;
