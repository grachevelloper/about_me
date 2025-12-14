import {query} from '../../configs/api';

import {EntityAttachmentType} from './MdEditor';

export const imageUploadHandler = (
    entityType: EntityAttachmentType,
    entityId: string
) => {
    return async (image: File) => {
        const formData = new FormData();
        formData.append('image', image);
        const response = await query.post('/attachments', {
            entityId,
            entityType,
        });
        return response;
    };
};
