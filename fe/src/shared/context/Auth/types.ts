import {Dispatch, SetStateAction} from 'react';

import {User} from '@/users/types';

export interface UserContextType {
    user?: User;
    setUserData: Dispatch<SetStateAction<User | undefined>>;
}

export const UserVoid = {
    user: undefined,
    setUserData: () => {},
};
