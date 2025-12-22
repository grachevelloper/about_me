import {SyncOutlined} from '@ant-design/icons';
import {Tag as AntTag, message, theme} from 'antd';
import block from 'bem-cn-lite';
import {Fragment, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {useDeleteTag} from '../../store/tags';
import {Tag} from '../../types';

import './ArticleTag.scss';

const b = block('article-tag');

interface TagProps {
    tag: Tag;
    deletable?: {
        onDelete: (id: string) => void;
    };
}

export const ArticleTag = ({tag, deletable}: TagProps) => {
    const {
        token: {colorPrimary, colorBorder, borderRadius, colorBgBase},
    } = theme.useToken();
    const {t} = useTranslation('articles');

    const [messageApi, contextHolder] = message.useMessage();

    const {
        mutate: deleteTag,
        error: errorDelete,
        isPending: isDeletePending,
    } = useDeleteTag();

    const handleClose = useCallback(() => {
        deletable?.onDelete(tag.id);
    }, [deleteTag, tag.id, messageApi, t]);

    useEffect(() => {
        if (errorDelete) {
            messageApi.open({
                type: 'error',
                content: t('articles.tags.delete.error.title'),
            });
        }
    }, [errorDelete, messageApi, t]);

    return (
        <Fragment>
            {contextHolder}
            <AntTag
                color={isDeletePending ? 'processing' : `${colorBgBase}`}
                icon={isDeletePending ? <SyncOutlined spin /> : undefined}
                style={{
                    borderRadius,
                    backgroundColor: colorPrimary,
                }}
                className={b()}
                closable={!!deletable}
                id={tag.id}
                onClose={deletable ? handleClose : undefined}
            >
                {tag.name}
            </AntTag>
        </Fragment>
    );
};
