import {
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from '@mdxeditor/editor';
import {JSX} from 'react';

import {query} from '../../configs/api';
import {AttachmentResponse} from '../../entities/Attachment';

import {EntityAttachmentType} from './MdEditor';

type WritePluginsProps = {
    entityId: string;
    entityType: EntityAttachmentType;
    toolbar: () => JSX.Element;
};

export const readPlugins = [
    headingsPlugin({allowedHeadingLevels: [1, 2, 3]}),
    linkPlugin(),
    listsPlugin(),
    linkDialogPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
];

export const writePlugins = ({
    entityType,
    entityId,
    toolbar,
}: WritePluginsProps) => {
    return [
        ...readPlugins,
        toolbarPlugin({
            toolbarContents: toolbar,
        }),
        imagePlugin({
            imageUploadHandler: imageUploadHandler(entityType, entityId),
        }),
    ];
};

const imageUploadHandler = (
    entityType: EntityAttachmentType,
    entityId: string
) => {
    return async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await query.post<AttachmentResponse>(
            `/attachments/${entityType}/${entityId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.url;
    };
};
