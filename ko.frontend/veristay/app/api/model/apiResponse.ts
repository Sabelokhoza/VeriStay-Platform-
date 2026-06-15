// Create a generic API response type
export default interface ApiResponse<T = any> {
    data: T;
    success: boolean;
    message: string;
    details: any;
    traceId: string | null;
    timestamp: string;
}

export interface RtkQueryResponse<T = any> {
    data?: ApiResponse<T>;
    error?: any;
}
