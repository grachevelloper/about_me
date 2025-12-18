import {BaseEntity, Role} from '@/typings/common';

export interface User extends BaseEntity {
    email: string;
    avatar?: string;
    username?: string;
    password: string;
    role?: Role;

    nowWatch?: string;
    nowReading?: string;
    newListening?: string;
    nowBeingIn?: string;
}

export interface SubmitData {
    isLoading: boolean;
    onSubmit: () => void;
}
