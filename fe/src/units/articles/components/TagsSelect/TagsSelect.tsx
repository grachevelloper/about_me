import {message, Select, theme} from 'antd';
import block from 'bem-cn-lite';
import {Fragment, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {useGetTags} from '../../store/tags';
import {Tag} from '../../types';

import './TagsSelect.scss';

const b = block('tags-select');

interface TagsSelectProps {
    onChange: (tags: Tag[]) => void;
    value?: Tag[];
}

export const TagsSelect = ({onChange, value}: TagsSelectProps) => {
    const {
        token: {},
    } = theme.useToken();

    const {t} = useTranslation('article');
    const {data: tags, error, isPending} = useGetTags();
    const [messageApi, messageContextHolder] = message.useMessage();

    const mappedTags = useMemo(() => {
        return (tags || []).map((tag: Tag) => {
            return {value: tag.name, label: tag.name, data: tag};
        });
    }, [tags]);

    const selectedValues = useMemo(() => {
        return (value || []).map((tag) => tag.name);
    }, [value]);

    const handleChange = useCallback(
        (selectedIds: string[]) => {
            if (!tags) return;

            const selectedTags = selectedIds
                .map((id) => tags.find((tag) => tag.id === id))
                .filter((tag): tag is Tag => tag !== undefined);

            onChange(selectedTags);
        },
        [onChange, tags]
    );

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
                allowClear
                mode='multiple'
                placeholder={t('articles.tags.select.placeholder')}
                loading={isPending}
                showSearch
                size='middle'
                className={b()}
                options={mappedTags}
                onChange={handleChange}
                value={selectedValues}
                title={t('articles.form.tags.select')}
                optionFilterProp='label'
                filterOption={(input, option) =>
                    ((option?.label as string) ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
            />
        </Fragment>
    );
};
