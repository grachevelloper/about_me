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
    return async (image: File) => {
        const formData = new FormData();
        formData.append('image', image);
        const response = await query.post(
            `/attachments/${entityType}/${entityId}`,
            {
                data: formData,

                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response;
    };
};
