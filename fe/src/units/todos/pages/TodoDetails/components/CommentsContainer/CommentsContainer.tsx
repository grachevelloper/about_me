import {Space} from 'antd';
import {PropsWithChildren} from 'react';

import {useAuth} from '@/shared/context';
import {Comment} from '@/shared/entities/Comment';

interface CommentsContainer {
    todoId: string;
}

export const CommentsContainer = ({
    todoId,
    children,
}: PropsWithChildren<CommentsContainer>) => {
    const {user} = useAuth();
    return (
        <Space align='start' direction='vertical'>
            {children}
            <Comment
                isNew
                comment={{
                    author: user!,
                    content: '',
                    depth: 0,
                    entityType: 'todo',
                    parentId: null,
                    entityId: todoId,
                    likesCount: 0,
                }}
            />
        </Space>
    );
};
