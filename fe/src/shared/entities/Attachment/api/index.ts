import {query} from '@/shared/configs/api';

import {AttachmentResponse, AttachmentsApi, EntityAttachmentType} from './types';

const api: AttachmentsApi = {
    uploadAttachment: async (
        entityType: EntityAttachmentType,
        entityId: string,
        file: File
    ) => {
        const formData = new FormData();
        formData.append('file', file);

        return await query.post<AttachmentResponse>(
            `/attachments/${entityType}/${entityId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    },

    deleteAttachment: async (id: string) => {
        await query.delete(`/attachments/${id}`);
    },
};

export default api;
