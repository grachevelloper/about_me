import {
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';

import api from '../api';
import {CreateCommentDto, ListComments, UpdateCommentDto} from '../api/types';
import {Comment} from '../types';

export const useCommentsQuery = (listCommentsData: ListComments) => {
    const {data} = useSuspenseQuery({
        queryKey: [
            'comments',
            listCommentsData.entityType,
            listCommentsData.entityId,
        ],
        queryFn: () => api.listComments(listCommentsData),
    });

    return {data};
};

export const useCommentQuery = (commentId: string) => {
    const {data, isPending, isError} = useQuery(
        {
            queryKey: ['comment', commentId],
            queryFn: () => api.getComment(commentId),
        },
        queryClient
    );

    return {comment: data, isPending, isError};
};

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation(
        {
            mutationFn: (createData: CreateCommentDto) =>
                api.createComment(createData),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['comments']});
            },
        },
        queryClient
    );
};

export const useCommentMutations = () => {
    const queryClient = useQueryClient();

    const updateMutation = useMutation(
        {
            mutationFn: (updateData: UpdateCommentDto) =>
                api.updateComment(updateData),
            onMutate: async (variables) => {
                await queryClient.cancelQueries({
                    queryKey: ['comment', variables.id],
                });

                const previousComment = queryClient.getQueryData<Comment>([
                    'comment',
                    variables.id,
                ]);

                if (previousComment) {
                    queryClient.setQueryData(['comment', variables.id], {
                        ...previousComment,
                        ...variables,
                    });
                }

                return {previousComment};
            },
            onError: (err, variables, context) => {
                if (context?.previousComment) {
                    queryClient.setQueryData(
                        ['comment', variables.id],
                        context.previousComment
                    );
                }
            },
            onSettled: (_data, _error, variables) => {
                queryClient.invalidateQueries({
                    queryKey: ['comment', variables.id],
                });
                queryClient.invalidateQueries({queryKey: ['comments']});
            },
        },
        queryClient
    );

    const deleteMutation = useMutation(
        {
            mutationFn: (id: string) => api.deleteComment(id),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['comments']});
            },
        },
        queryClient
    );

    return {
        updateMutation,
        deleteMutation,
    };
};
