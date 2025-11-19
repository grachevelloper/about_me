import {Skeleton, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useState} from 'react';

import {TODO_TITLE_MAX_LENGTH} from '@/shared/utils/constants';

import {BaseDetail} from '../types';

import './TodoTitile.scss';

const b = block('todo-title');

export const TodoTitle = ({content, onEnd, isPending}: BaseDetail<string>) => {
    if (isPending) {
        return <Skeleton.Input active size='small' style={{width: 200}} />;
    }
    const [newTitle, setNewTitle] = useState<string>(content as string);
    return (
        <Typography.Title
            level={1}
            editable={{
                icon: <div />,
                maxLength: TODO_TITLE_MAX_LENGTH,
                triggerType: ['text'],
                enterIcon: null,
                autoSize: true,
                onChange: setNewTitle,
                onEnd: () => onEnd('title', newTitle),
            }}
            rootClassName={b('textarea')}
        >
            {content}
        </Typography.Title>
    );
};
