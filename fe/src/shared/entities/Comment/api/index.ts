import {query} from '../../../configs/api';

import {
    CommentsApi,
    CreateCommentDto,
    ListComments,
    UpdateCommentDto,
} from './types';

const actions: CommentsApi = {
    createComment: async (craeteCommentData: CreateCommentDto) => {
        return await query.post('/comments', craeteCommentData);
    },

    listComments: async (listCommentsData: ListComments) => {
        const {entityId, entityType} = listCommentsData;
        return await query.get(`/comments/${entityType}/${entityId}`);
    },

    getComment: async (id: string) => {
        return await query.get(`/comments/${id}`);
    },

    deleteComment: async (id: string) => {
        return await query.delete(`comments/${id}`);
    },

    updateComment: async (updateCommentData: UpdateCommentDto) => {
        const {content, id} = updateCommentData;
        return await query.patch(`comments/${id}`, content);
    },
};
export default actions;
