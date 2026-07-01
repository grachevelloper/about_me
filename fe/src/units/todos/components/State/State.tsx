import './State.scss';

import {Button, Popover, Space, type ButtonProps} from 'antd';
import block from 'bem-cn-lite';
import {forwardRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {TodoState} from '@/todos/types';

// import fireAnimation from '../../../../../public/lotiie/fire.json';

const b = block('state');

const stateKeyByValue: Record<TodoState, string> = {
    [TodoState.IN_WORK]: 'in_work',
    [TodoState.PLANNING]: 'planning',
    [TodoState.FINISHED]: 'finished',
    [TodoState.CANCELED]: 'canceled',
};

const availableTransitions: Record<TodoState, TodoState[]> = {
    [TodoState.PLANNING]: [TodoState.IN_WORK, TodoState.CANCELED],
    [TodoState.IN_WORK]: [TodoState.FINISHED, TodoState.CANCELED],
    [TodoState.FINISHED]: [TodoState.IN_WORK],
    [TodoState.CANCELED]: [TodoState.PLANNING, TodoState.IN_WORK],
};

interface StateProps {
    state: TodoState;
    editable?: false | {isEdited: boolean};
    onUpdate?: (state: TodoState) => void;
    isLoading?: boolean;
}

const getCustomize = (state: TodoState): Pick<
    ButtonProps,
    'color' | 'variant'
> => {
    switch (state) {
        case TodoState.CANCELED:
            return {color: 'red', variant: 'filled'};
        case TodoState.FINISHED:
            return {color: 'green', variant: 'filled'};
        case TodoState.IN_WORK:
            return {color: 'default', variant: 'filled'};
        case TodoState.PLANNING:
            return {color: 'default', variant: 'filled'};
    }
};

export const State = forwardRef<HTMLButtonElement, StateProps>(
    ({state, editable, onUpdate, isLoading}, ref) => {
        const {t} = useTranslation('todo');
        const [isOpen, setIsOpen] = useState(false);

        const isEdited = editable && editable?.isEdited;
        const transitions = availableTransitions[state];
        const currentLabel = t(`todo.state.${stateKeyByValue[state]}`);
        const handleUpdate = (newState: TodoState) => {
            onUpdate?.(newState);
            setIsOpen(false);
        };
        const content = (
            <Space direction='vertical' size={4}>
                {transitions.map((nextState) => (
                    <Button
                        key={nextState}
                        type='text'
                        size='small'
                        block
                        onClick={() => handleUpdate(nextState)}
                        {...getCustomize(nextState)}
                    >
                        {t(`todo.state.${stateKeyByValue[nextState]}`)}
                    </Button>
                ))}
            </Space>
        );

        return (
            <Popover
                title={t('todo.change.state')}
                content={content}
                trigger='click'
                open={Boolean(onUpdate) && isOpen}
                onOpenChange={(nextOpen) => setIsOpen(nextOpen)}
            >
                {/* {isRotated ? (
                <Lottie
                    animationData={fireAnimation}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: elementWidth,
                    }}
                    loop={false}
                />
            ) : null} */}
                <Button
                    className={b({
                        'is-edited': isEdited,
                    })}
                    disabled={!onUpdate}
                    loading={isLoading}
                    ref={ref}
                    {...getCustomize(state)}
                >
                    {currentLabel}
                </Button>
            </Popover>
        );
    }
);
