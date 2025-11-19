import {query} from '../configs/api';

export const checkAuth = async () => {
    try {
        const response = await query.get<boolean>('/auth/check');
        return response;
    } catch {
        return false;
    }
};
