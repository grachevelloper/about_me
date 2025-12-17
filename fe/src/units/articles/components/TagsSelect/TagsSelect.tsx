import {message, Select, theme} from 'antd';
import block from 'bem-cn-lite';
import {Fragment, useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {useGetTags} from '../../store/tags';
import {Tag} from '../../types';

import './TagsSelect.scss';

const b = block('tags-select');

export const TagsSelect = () => {
    const {
        token: {},
    } = theme.useToken();

    const {t} = useTranslation('article');
    const {data: tags, error, isPending} = useGetTags();
    const [messageApi, messageContextHolder] = message.useMessage();

    const mappedTags = useMemo(() => {
        return (tags || []).map((tag: Tag) => {
            return {value: tag.name, label: tag.name};
        });
    }, [tags]);

    if (error) {
        messageApi.open({
            type: 'error',
            content: t('article.tags.error'),
        });
    }

    return (
        <Fragment>
            {messageContextHolder}

            <Select
                loading={isPending}
                className={b()}
                options={mappedTags}
                title={t('articles.form.tags.select')}
            />
        </Fragment>
    );
};
