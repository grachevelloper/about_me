import {AxiosError, InternalAxiosRequestConfig} from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        skipAuthRedirect?: boolean;
    }

    export interface InternalAxiosRequestConfig {
        skipAuthRedirect?: boolean;
    }
}

export interface CustomAxiosError extends AxiosError {
    config: InternalAxiosRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
        url?: string;
    };
}

export interface ApiErrorResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}
