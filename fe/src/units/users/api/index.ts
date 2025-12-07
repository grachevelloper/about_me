import axios from 'axios';

import {query} from '@/shared/configs/api';

import {User} from '../types';

import {
    DtoSignInUser,
    DtoSignUpUser,
    DtoUpdateUser,
    ResponseYandex0Auth,
    SignResponse,
    type UserApi,
} from './types';

const {YANDEX_CLIENT_ID} = process.env;

const Api: UserApi = {
    signIn: async (signInData: DtoSignInUser) => {
        await query.post<SignResponse>(`/auth/signin`, signInData);
    },

    signUp: async (signUpData: DtoSignUpUser) => {
        const result = await query.post<User>(`/auth/signup`, signUpData);
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

    updateUserById: async ({id, ...updateData}: DtoUpdateUser) => {
        const response = await query.patch<User>(`/user/${id}`, updateData);
        return response;
    },
};

export default Api;
