import {Button, Flex, Form, notification, Popover, Skeleton, theme} from 'antd';
import block from 'bem-cn-lite';
import {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {FormInput} from '@/shared/components/FormInput';

import {ButtonAccept} from '../../../../shared/components/actions';
import {useCreateTag} from '../../store/tags';
import {Tag} from '../../types';
import {ArticleTag} from '../ArticleTag';

import './TagsWrapper.scss';

const b = block('tags-wrapper');

interface TagsWrapperProps {
    isPending: boolean;
    tags?: Tag[];
    editable?: {
        onCreate: (tags: Tag[]) => void;
    };
}

type FormType = {
    name: string;
};

export const TagsWrapper = ({tags, isPending, editable}: TagsWrapperProps) => {
    const {
        token: {colorPrimary},
    } = theme.useToken();
    const {t} = useTranslation(['article', 'common']);
    const [notificationApi, contextNotificationHolder] =
        notification.useNotification();
    const {
        mutateAsync: createTag,

        error: createTagError,
        isPending: isCreateTagPending,
    } = useCreateTag();
    const [form] = Form.useForm<FormType>();
    const [submittable, setSubmittable] = useState<boolean>(false);
    const name = Form.useWatch([], form);

    const handleOk = useCallback(async () => {
        try {
            const values = await form.validateFields();

            const newTag = await createTag(values.name);
            if (editable && tags) {
                editable.onCreate([...tags, newTag]);
            }
            form.resetFields();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    }, [name, form, editable, tags]);

    useEffect(() => {
        form.validateFields({validateOnly: true})
            .then(() => setSubmittable(true))
            .catch(() => setSubmittable(false));
    }, [form, name]);

    const renderCreateTagPopover = useCallback(() => {
        return (
            <Form
                form={form}
                onFinish={handleOk}
                layout='vertical'
                className={b('create-tag-popover')}
                autoComplete='off'
            >
                <FormInput
                    field={{
                        placeholder: t('articles.tags.create.placeholder'),
                        name: 'name',
                        label: t('articles.tags.create.label'),
                        index: 0,
                        rules: [
                            {
                                required: true,
                                message: t('article.tags.name.required'),
                            },
                            {min: 2, message: t('article.tags.name.min')},
                        ],
                        className: b('create-tag-name-field'),
                    }}
                />
                <ButtonAccept
                    loading={isCreateTagPending}
                    onClick={handleOk}
                    disabled={!submittable || isCreateTagPending}
                    className={b('create-button')}
                    text={t('create')}
                />
            </Form>
        );
    }, [handleOk, isCreateTagPending, form, submittable, t]);

    useEffect(() => {
        if (createTagError) {
            notificationApi.error({
                message: t('article.tags.create.error.message'),
            });
        }
    }, [createTagError, notificationApi, t]);

    if (isPending) {
        return <Skeleton.Node className={b('skeleton')} />;
    }
    console.log(tags);
    return (
        <Flex align='center' justify='start' gap={2} className={b()}>
            {contextNotificationHolder}
            {tags?.map((tag: Tag) => (
                <ArticleTag tag={tag} key={tag.id} editable={editable} />
            ))}
            {editable && (
                <Popover
                    trigger='click'
                    placement='rightTop'
                    content={renderCreateTagPopover}
                >
                    <Button variant='solid' color={colorPrimary}>
                        {t('articles.tags.create.button')}
                    </Button>
                </Popover>
            )}
        </Flex>
    );
};
