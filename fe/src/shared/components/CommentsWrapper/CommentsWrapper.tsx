import {Flex} from 'antd';
import block from 'bem-cn-lite';

import {useAuth} from '@/shared/context';
import {
    Comment,
    type CommentType,
    EntityCommentType,
    useCommentsQuery,
} from '@/shared/entities/Comment';

import './CommentsWrapper.scss';

const b = block('comments-wrapper');

interface CommentsContainer {
    entityType: EntityCommentType;
    entityId: string;
}

export const CommentsWrapper = ({entityId, entityType}: CommentsContainer) => {
    const {user} = useAuth();
    const {comments, isPending, isError} = useCommentsQuery({
        entityId,
        entityType,
    });
    return (
        <Flex align='start' justify='start' vertical rootClassName={b()}>
            <Comment
                isNew
                comment={{
                    author: user!,
                    content: '',
                    depth: 0,
                    entityType: 'todo',
                    parentId: null,
                    entityId: entityId,
                    likesCount: 0,
                }}
            />
            {(comments || []).map((comment: CommentType) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </Flex>
    );
};
