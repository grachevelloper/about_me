import {type User} from '@/users/types';

import {apiAxios} from '../../../configs/api';

export const isMe = async () => {
    const response = await apiAxios.get<User>('/auth/me');
    return response;
};
