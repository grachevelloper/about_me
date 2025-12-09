import {QueryClient} from '@tanstack/react-query';
import axios, {AxiosInstance, AxiosResponse} from 'axios';

import {ApiErrorResponse, CustomAxiosError} from '@/typings/axios';

export const apiAxios: AxiosInstance = axios.create({
    baseURL: `/api`,
    timeout: 3000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
});

apiAxios.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error: CustomAxiosError) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/auth/refresh')) {
            if (error.response?.status === 401) {
                console.error('Refresh token expired');
                if (!window.location.pathname.startsWith('/auth')) {
                    window.location.pathname = 'auth/signin';
                }
                return Promise.reject(error.response.data);
            }
        }

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            try {
                await apiAxios.post('/auth/refresh');
                return apiAxios(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }
        }

        const errorData: ApiErrorResponse = error.response?.data || {
            message: 'Unknown error occurred',
        };

        console.error('Error from backend:', errorData);
        return Promise.reject(error.response.data);
    }
);

export const query = {
    get: <T = any>(url: string) => apiAxios.get<T>(url) as Promise<T>,
    post: <T = any>(url: string, data?: any) =>
        apiAxios.post<T>(url, data) as Promise<T>,
    patch: <T = any>(url: string, data?: any) =>
        apiAxios.patch<T>(url, data) as Promise<T>,
    put: <T = any>(url: string, data?: any) =>
        apiAxios.put<T>(url, data) as Promise<T>,
    delete: <T = any>(url: string) => apiAxios.delete<T>(url) as Promise<T>,
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            retry: 3,
            refetchOnReconnect: true,
            refetchOnMount: true,
        },
    },
});
