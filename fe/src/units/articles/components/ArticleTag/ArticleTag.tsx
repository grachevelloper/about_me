import {SyncOutlined} from '@ant-design/icons';
import {Tag as AntTag, message, theme} from 'antd';
import block from 'bem-cn-lite';
import {Fragment, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {useDeleteTag} from '../../store/tags';
import {Tag} from '../../types';

import './ArticleTag.scss';

const b = block('article-tag');

interface TagProps {
    tag: Tag;
    editable?: {
        onCreate: (tags: Tag[]) => void;
    };
}

export const ArticleTag = ({tag, editable}: TagProps) => {
    const {
        token: {colorPrimary, colorBorder, borderRadius},
    } = theme.useToken();
    const {t} = useTranslation('articles');

    const [messageApi, contextMessageHandler] = message.useMessage();

    const {
        mutate: deleteTag,
        error: errorDelete,
        isPending: isDeletePending,
    } = useDeleteTag();

    const handleClose = useCallback(
        (e: React.MouseEvent<HTMLSpanElement>) => {
            e.preventDefault();

            if (editable) {
                deleteTag(tag.id, {
                    onSuccess: () => {
                        // Здесь нужно обновить список тегов в родительском компоненте
                        // Для этого в editable должен быть onDelete, а не только onCreate
                        // Сейчас эта логика отсутствует
                    },
                    onError: (error) => {
                        messageApi.open({
                            type: 'error',
                            content: t('articles.tags.delete.error.title'),
                        });
                    },
                });
            }
        },
        [deleteTag, editable, tag.id, messageApi, t]
    );

    if (errorDelete) {
        messageApi.open({
            type: 'error',
            content: t('articles.tags.delete.error.title'),
        });
    }

    return (
        <Fragment>
            {contextMessageHandler}
            <AntTag
                color={isDeletePending ? 'processing' : 'primary'}
                icon={isDeletePending ? <SyncOutlined spin /> : undefined}
                style={{
                    borderRadius,
                    border: `1px solid ${colorBorder}`,
                }}
                className={b()}
                closable={!!editable}
                id={tag.id}
                onClose={editable ? handleClose : undefined}
            >
                {tag.name}
            </AntTag>
        </Fragment>
    );
};
