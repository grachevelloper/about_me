import {type User} from '@/users/types';

import {apiAxios} from '../../../configs/api';

export const isMe = async (): Promise<User> => {
    return apiAxios.get<User>('/auth/me') as unknown as Promise<User>;
};
