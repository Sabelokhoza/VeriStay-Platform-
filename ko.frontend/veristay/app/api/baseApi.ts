import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { toast } from 'react-toastify';

const customBaseQuery = fetchBaseQuery({
    baseUrl: 'http://veristay2.runasp.net/api',
    // baseUrl: 'https://localhost:7078/api',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export type ApiResponse = {
    data: any;
    message: string;
    success: boolean;
    details?: string | null;
    traceId?: string;
    timestamp?: string;
};

export const baseQueryWithErrorHandling = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {
    const result = await customBaseQuery(args, api, extraOptions);

    if (result.error) {
        const { status, data } = result.error;
        const apiResponse = data as ApiResponse;
        const errorMessage = apiResponse?.message || 'An unexpected error occurred';

        switch (status) {
            case 400:
                console.error('Bad Request:', errorMessage);
                toast.error(errorMessage);
                break;
            case 401:
                toast.error('Unauthorized: Please login again.');
                break;
            case 404:
                toast.error(errorMessage);
                break;
            case 500:
                toast.error(errorMessage);
                break;
            default:
                toast.error(errorMessage);
                break;
        }
    }
    return result;
};
