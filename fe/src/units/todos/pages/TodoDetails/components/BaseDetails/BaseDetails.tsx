import {Col, Divider, Row, theme} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import block from 'bem-cn-lite';

import {CommentsWrapper} from '@/shared/components/CommentsWrapper';

import {Priority} from '@/todos/components/Priority';
import {State} from '@/todos/components/State';
import {useTodoMutations} from '@/todos/store';
import {type Todo, type TodoPriority, type TodoState} from '@/todos/types';

import {Checklist} from './components/Checklist';
import {TodoTitle} from './components/TodoTitle';
import {UpdateField} from './components/types';

import './BaseDetailts.scss';

const b = block('base-details');

interface BaseDetailsProps {
    initialData: Todo;
}

export const BaseDetails = ({initialData}: BaseDetailsProps) => {
    const {
        token: {borderRadius, colorBorder},
    } = theme.useToken();
    const {
        updateTitle,
        updatePriority,
        updateState,
        updateContent,
        isPending,
    } = useTodoMutations();

    const handleEnd = <T extends UpdateField>(
        newValueType: T,
        newValue: Todo[T]
    ) => {
        switch (newValueType) {
            case 'title':
                updateTitle(initialData.id, newValue as string);
                break;
            case 'priority':
                updatePriority(initialData.id, newValue as TodoPriority);
                break;
            case 'state':
                updateState(initialData.id, newValue as TodoState);
                break;
            case 'content':
                updateContent(initialData.id, newValue as string);
                break;
        }
    };

    const handleContentChange = (value: string) => {
        handleEnd('content', value);
    };
    console.log(`${borderRadius}px solid ${colorBorder}`);

    return (
        <div className={b()}>
            <Divider titlePlacement='start' orientationMargin={0}>
                <TodoTitle onEnd={handleEnd} content={initialData.title} />
            </Divider>
            <Row gutter={32} justify='start'>
                <Col>
                    <Priority
                        priority={initialData.priority}
                        onUpdate={(priority: TodoPriority) =>
                            handleEnd('priority', priority)
                        }
                        isLoading={isPending}
                    />
                </Col>
                <Col>
                    <State
                        state={initialData.state}
                        onUpdate={(state: TodoState) =>
                            handleEnd('state', state)
                        }
                        isLoading={isPending}
                    />
                </Col>
            </Row>
            <Row justify='end' align='top' gutter={32}>
                <Col xs={24} lg={16}>
                    <TextArea
                        className={b('content')}
                        defaultValue={initialData.content}
                        variant='borderless'
                        autoSize={{minRows: 6, maxRows: 24}}
                        onBlur={(e) => handleContentChange(e.target.value)}
                        style={{
                            border: `2px solid ${colorBorder}`,
                        }}
                    />
                </Col>
                <Col xs={24} lg={8}>
                    <Checklist todoId={initialData.id} />
                </Col>
            </Row>
            <Row>
                <Col xs={24} lg={16}>
                    <CommentsWrapper
                        entityId={initialData.id}
                        entityType='todo'
                    />
                </Col>
            </Row>
        </div>
    );
};
