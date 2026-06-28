import axios from 'axios';

import {query} from '@/shared/configs/api';

import {User} from '../types';

import {
    DtoChangePassword,
    DtoSignInUser,
    DtoSignUpUser,
    DtoUpdateUser,
    ResponseYandex0Auth,
    SignResponse,
    type UserApi,
} from './types';

const {YANDEX_CLIENT_ID} = process.env;

const Api: UserApi = {
    signIn: async (data: DtoSignInUser) => {
        return query.post<SignResponse>(`/auth/signin`, data);
    },

    signUp: async (data: DtoSignUpUser) => {
        const result = await query.post<User>(`/auth/signup`, data);
        return result;
    },

    logout: async () => {
        await query.post('/auth/logout');
    },

    yandexSignIn: async () => {
        const response = await axios.get<ResponseYandex0Auth>(
            'https://login.yandex.ru/info',
            {
                params: {
                    format: 'json',
                },
                headers: {
                    Authorization: `OAuth ${YANDEX_CLIENT_ID}`,
                },
            }
        );
        return response.data;
    },

    getMe: async () => {
        return await query.get<User>('/users/me');
    },

    updateMe: async (data: Omit<DtoUpdateUser, 'id'>) => {
        return await query.patch<User>('/users/me', data);
    },

    changeMyPassword: async (data: DtoChangePassword) => {
        await query.patch('/users/me/password', data);
    },

    getUserById: async (id: string) => {
        return await query.get<User>(`/users/${id}`);
    },

    updateUserById: async ({id, ...data}: DtoUpdateUser) => {
        const response = await query.patch<User>(`/users/${id}`, data);
        return response;
    },

    changeUserPassword: async (id: string, data: DtoChangePassword) => {
        await query.patch(`/users/${id}/password`, data);
    },

    deleteUserById: async (id: string) => {
        await query.delete(`/users/${id}`);
    },
};

export default Api;
