import {useMutation} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';

import api from '../api';
import {ToggleLikeData} from '../api/types';

export const useToggleLikeMutation = () => {
    return useMutation({
        mutationFn: ({entityId, entityType, hasLiked}: ToggleLikeData) =>
            hasLiked
                ? api.deleteLike(entityType, entityId)
                : api.createLike(entityType, entityId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [`${variables.entityType}s`],
            });
        },
    });
};
