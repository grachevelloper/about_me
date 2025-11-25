import {EditTwoTone} from '@ant-design/icons';
import {Divider, Flex, Form, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {ButtonAccept, ButtonDeny} from '../../components/actions';
import {FormInput} from '../../components/FormInput';
import {User} from '../../components/User';
import {useAuth} from '../../context';
import {useLocalStorage} from '../../hooks';
import {formatDate} from '../../utils/date';

import {useCommentMutations, useCreateCommentMutation} from './store';
import {type Comment as CommentType} from './types';

import './Comment.scss';

const b = block('comment');

interface CommentProps {
    isNew: boolean;
    comment: CommentType;
}

export const Comment = ({comment, isNew = false}: CommentProps) => {
    const {user} = useAuth();
    const {
        createdAt,
        likesCount,
        depth,
        parentId,
        entityId,
        entityType,
        content,
        id,
        author,
    } = comment || {
        parentId: null,
    };

    const {t} = useTranslation('common');
    const [form] = Form.useForm();
    const {updateMutation} = useCommentMutations();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [localContent, setLocalContent] = useLocalStorage<string>(
        `comment-${id}`,
        content
    );

    const {
        mutate: mutateUpdate,
        isPending: isPendindUpdate,
        isError: isErrorUpdate,
    } = updateMutation;

    const {
        mutate: mutateCreate,
        isPending: isPendingCreate,
        isError: isErrorCreate,
    } = useCreateCommentMutation();

    const isEditable = user?.id === author?.id;

    const handleOk = () => {
        if (isNew) {
            mutateCreate({
                entityId,
                entityType,
                parentId,
                content: localContent,
            });
        } else {
            mutateUpdate({
                id: id!,
                content: localContent,
            });
        }
    };

    const handleSetEditing = () => {
        setIsEditing(true);
    };

    const handleValuesChange = (changedContent: string) => {
        setLocalContent(changedContent);
    };

    useEffect(() => {
        if (localContent) {
            form.setFieldsValue(localContent);
        }
    }, [localContent, form]);

    if (isNew || isEditing) {
        return (
            <Form
                form={form}
                layout='vertical'
                onFinish={handleOk}
                onValuesChange={handleValuesChange}
            >
                <Flex justify='start' vertical align='start' className={b()}>
                    <FormInput
                        field={{
                            label: `comment-${id}`,
                            name: `comment-${id}`,
                            type: 'text',
                            placeholder: t('comment.placeholder'),
                        }}
                    />
                </Flex>
                <Flex
                    justify='space-between'
                    align='start'
                    className={b('actions')}
                >
                    <ButtonDeny text={t('cancel')} />
                    <ButtonAccept text={isNew ? t('create') : t('edit')} />
                </Flex>
            </Form>
        );
    }

    return (
        <Flex justify='start' vertical align='start'>
            <Flex justify='space-between' align='start'>
                <Flex align='start' gap={3} justify='start'>
                    <User data={author} />
                    <Typography.Text>{formatDate(createdAt!)}</Typography.Text>
                </Flex>
                {isEditable && <EditTwoTone onClick={handleSetEditing} />}
            </Flex>
            <Divider />
            <Typography.Text>{content}</Typography.Text>
        </Flex>
    );
};
