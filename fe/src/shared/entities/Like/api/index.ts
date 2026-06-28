import {query} from '@/shared/configs/api';

import {EntityLikeType, LikesApi} from './types';

const api: LikesApi = {
    createLike: async (entityType: EntityLikeType, entityId: string) => {
        await query.post(`/likes/${entityType}/${entityId}`);
    },

    deleteLike: async (entityType: EntityLikeType, entityId: string) => {
        await query.delete(`/likes/${entityType}/${entityId}`);
    },
};

export default api;
