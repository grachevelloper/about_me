import {Dispatch, SetStateAction} from 'react';

import {User} from '@/typings/entities';

export interface UserContextType {
    user?: User;
    setUserData: Dispatch<SetStateAction<User | undefined>>;
}

export const UserVoid = {
    user: undefined,
    setUserData: () => {},
};
