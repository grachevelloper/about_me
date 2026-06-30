import {useMutation} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';
import {PaginatedResponse} from '@/typings/common';

import api from '../api';
import {EntityLikeType, ToggleLikeData} from '../api/types';

interface LikedEntityCache {
    id: string;
    hasLiked: boolean;
    likesCount: number;
}

const detailKeyByEntityType = (
    entityType: EntityLikeType,
    entityId: string
) => {
    if (entityType === 'article') {
        return ['articles', 'detail', entityId] as const;
    }

    if (entityType === 'comment') {
        return ['comment', entityId] as const;
    }

    return ['todo', entityId] as const;
};

const listsKeyByEntityType = (entityType: EntityLikeType) => {
    if (entityType === 'article') {
        return ['articles'] as const;
    }

    if (entityType === 'comment') {
        return ['comments'] as const;
    }

    return ['todos'] as const;
};

const getOptimisticEntity = <T extends Partial<LikedEntityCache>>(
    entity: T | undefined,
    hasLiked: boolean
): T | undefined => {
    if (!entity) {
        return entity;
    }

    const currentLikesCount = entity.likesCount ?? 0;

    return {
        ...entity,
        hasLiked: !hasLiked,
        likesCount: hasLiked
            ? Math.max(currentLikesCount - 1, 0)
            : currentLikesCount + 1,
    };
};

const updateCommentsCache = (entityId: string, hasLiked: boolean) => {
    queryClient.setQueriesData<PaginatedResponse<LikedEntityCache>>(
        {queryKey: ['comments']},
        (previous) => {
            if (!previous) {
                return previous;
            }

            return {
                ...previous,
                items: previous.items.map((comment) =>
                    comment.id === entityId
                        ? (getOptimisticEntity(comment, hasLiked) ?? comment)
                        : comment
                ),
            };
        }
    );
};

export const useToggleLikeMutation = () => {
    return useMutation({
        mutationFn: ({entityId, entityType, hasLiked}: ToggleLikeData) =>
            hasLiked
                ? api.deleteLike(entityType, entityId)
                : api.createLike(entityType, entityId),
        onMutate: async (variables) => {
            const detailKey = detailKeyByEntityType(
                variables.entityType,
                variables.entityId
            );

            await queryClient.cancelQueries({queryKey: detailKey});
            await queryClient.cancelQueries({
                queryKey: listsKeyByEntityType(variables.entityType),
            });

            const previousDetail =
                queryClient.getQueryData<LikedEntityCache>(detailKey);

            queryClient.setQueryData(
                detailKey,
                getOptimisticEntity(previousDetail, variables.hasLiked)
            );

            if (variables.entityType === 'comment') {
                updateCommentsCache(variables.entityId, variables.hasLiked);
            }

            return {previousDetail};
        },
        onError: (_error, variables, context) => {
            if (context?.previousDetail) {
                queryClient.setQueryData(
                    detailKeyByEntityType(
                        variables.entityType,
                        variables.entityId
                    ),
                    context.previousDetail
                );
            }
            queryClient.invalidateQueries({
                queryKey: listsKeyByEntityType(variables.entityType),
            });
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({
                queryKey: detailKeyByEntityType(
                    variables.entityType,
                    variables.entityId
                ),
            });
            queryClient.invalidateQueries({
                queryKey: listsKeyByEntityType(variables.entityType),
            });
        },
    });
};
