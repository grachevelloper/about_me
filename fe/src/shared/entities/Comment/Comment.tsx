import {CloseOutlined, EditTwoTone} from '@ant-design/icons';
import {Divider, Flex, Spin, Typography} from 'antd';
import block from 'bem-cn-lite';
import {Fragment, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {User} from '../../components/User';
import {useAuth} from '../../context';
import {useLocalStorage} from '../../hooks';
import {formatDate} from '../../utils/date';

import {CommentForm} from './components/CommentForm';
import {useCommentMutations, useCreateCommentMutation} from './store';
import {type CommentType} from './types';

import './Comment.scss';

const b = block('comment');

interface CommentProps {
    comment: CommentType;
    isNew?: boolean;
    className?: string;
}

export const Comment = ({comment, className, isNew = false}: CommentProps) => {
    const {user} = useAuth();
    const {
        createdAt,
        updatedAt,
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

    const [isReplyVisible, setReplyVisible] = useState<boolean>(false);
    const {t} = useTranslation('common');
    const {updateMutation, deleteMutation} = useCommentMutations();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isActionIconsVisible, setActionIconsVisible] =
        useState<boolean>(false);
    const [localContent, setLocalContent] = useLocalStorage<string>(
        `comment-${id}`,
        content
    );

    const {
        mutate: mutateDelete,
        isPending: isPendindDelete,
        isError: isErrorDelete,
    } = deleteMutation;

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

    const handleCreate = (content: string, isResponse = false) => {
        mutateCreate({
            entityId,
            entityType,
            parentId: isResponse ? id! : parentId,
            content,
        });
        setLocalContent('');
        setReplyVisible(false);
    };

    const handleUpdate = (content: string) => {
        mutateUpdate({
            id: id!,
            content,
        });
    };

    const handleRemove = () => {
        if (id) {
            mutateDelete(id);
        }
    };

    const handleSetEditing = () => {
        setIsEditing(true);
    };

    const handleReply = () => {
        setReplyVisible(true);
    };

    if (isNew || isEditing) {
        return (
            <CommentForm
                isCompletePending={
                    isEditing ? isPendindUpdate : isPendingCreate
                }
                depth={depth}
                onCancel={isEditing ? () => setIsEditing(false) : undefined}
                onComplete={isEditing ? handleUpdate : handleCreate}
                content={localContent}
            />
        );
    }

    return (
        <Fragment>
            <Flex
                onMouseEnter={() => {
                    setActionIconsVisible(true);
                }}
                onMouseLeave={() => {
                    setActionIconsVisible(false);
                }}
                justify='start'
                vertical
                align='start'
                className={b(null, className)}
                style={{
                    paddingLeft: `${20 * depth}px`,
                }}
            >
                <Flex
                    justify='space-between'
                    align='center'
                    className={b('title')}
                >
                    <Flex align='start' justify='start' gap={8}>
                        <User data={author} />
                        {createdAt && (
                            <Typography.Text rootClassName={b('created-at')}>
                                {formatDate(createdAt)}
                            </Typography.Text>
                        )}
                    </Flex>
                    <Flex>
                        {updatedAt && updatedAt !== createdAt && (
                            <Typography.Text rootClassName={b('created-at')}>
                                {t('updated-at')}
                                {formatDate(updatedAt)}
                            </Typography.Text>
                        )}
                        {isEditable ? (
                            <span>
                                {isActionIconsVisible && (
                                    <Flex gap={6}>
                                        <EditTwoTone
                                            onClick={handleSetEditing}
                                            className={b('icon')}
                                        />

                                        {isPendindDelete ? (
                                            <Spin size='small' />
                                        ) : (
                                            <CloseOutlined
                                                className={b('icon', {
                                                    error: true,
                                                })}
                                                onClick={handleRemove}
                                            />
                                        )}
                                    </Flex>
                                )}
                            </span>
                        ) : (
                            <span className={b('reply')} onClick={handleReply}>
                                {t('comment.reply')}
                            </span>
                        )}
                    </Flex>
                </Flex>
                <Typography.Text className={b('content')}>
                    {content}
                </Typography.Text>
                <Divider rootClassName={b('divider')} />
            </Flex>
            {isReplyVisible ? (
                <CommentForm
                    depth={depth}
                    onCancel={() => setReplyVisible(false)}
                    onComplete={handleCreate}
                    isCompletePending={isPendingCreate}
                />
            ) : null}
        </Fragment>
    );
};
