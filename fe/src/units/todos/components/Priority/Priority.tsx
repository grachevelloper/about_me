import {DoubleLeftOutlined} from '@ant-design/icons';
import {Button, Popover, Space, type ButtonProps} from 'antd';
import block from 'bem-cn-lite';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {TodoPriority} from '@/todos/types';

import './Priority.scss';

const b = block('priority');

const priorityKeyByValue: Record<TodoPriority, string> = {
    [TodoPriority.LOW]: 'low',
    [TodoPriority.MEDIUM]: 'medium',
    [TodoPriority.HIGH]: 'high',
    [TodoPriority.SUPER]: 'super',
};

const priorities = [
    TodoPriority.LOW,
    TodoPriority.MEDIUM,
    TodoPriority.HIGH,
    TodoPriority.SUPER,
];

interface PriorityProps {
    priority: TodoPriority;
    editable?: {isEdited: boolean};
    onUpdate?: (priority: TodoPriority) => void;
    isLoading?: boolean;
}

const getCustomize = (priority: TodoPriority): Pick<
    ButtonProps,
    'variant' | 'color' | 'icon'
> => {
    switch (priority) {
        case TodoPriority.LOW:
            return {
                variant: 'filled',
                color: 'green',
            };
        case TodoPriority.MEDIUM:
            return {
                variant: 'filled',
                color: 'default',
            };
        case TodoPriority.HIGH:
            return {
                variant: 'solid',
                color: 'orange',
            };
        case TodoPriority.SUPER:
            return {
                variant: 'solid',
                color: 'red',
                icon: <DoubleLeftOutlined rotate={90} />,
            };
    }
};

export const Priority = ({
    priority,
    onUpdate,
    editable,
    isLoading,
}: PriorityProps) => {
    const {t} = useTranslation('todo');
    const [isOpen, setIsOpen] = useState(false);
    const isEdited = Boolean(editable?.isEdited);

    const customize = getCustomize(priority);
    const availablePriorities = priorities.filter(
        (nextPriority) => nextPriority !== priority
    );
    const handleUpdate = (newPriority: TodoPriority) => {
        onUpdate?.(newPriority);
        setIsOpen(false);
    };
    const content = (
        <Space direction='vertical' size={4}>
            {availablePriorities.map((nextPriority) => (
                <Button
                    key={nextPriority}
                    type='text'
                    size='small'
                    block
                    onClick={() => handleUpdate(nextPriority)}
                    {...getCustomize(nextPriority)}
                >
                    {t(`todo.priority.${priorityKeyByValue[nextPriority]}`)}
                </Button>
            ))}
        </Space>
    );

    return (
        <Popover
            title={t('todo.change.priority')}
            content={content}
            trigger='click'
            open={Boolean(onUpdate) && isOpen}
            onOpenChange={(nextOpen) => setIsOpen(nextOpen)}
        >
            <Button
                className={b({'is-edited': isEdited})}
                disabled={!onUpdate}
                loading={isLoading}
                size='middle'
                {...customize}
            >
                {t(`todo.priority.${priorityKeyByValue[priority]}`)}
            </Button>
        </Popover>
    );
};
