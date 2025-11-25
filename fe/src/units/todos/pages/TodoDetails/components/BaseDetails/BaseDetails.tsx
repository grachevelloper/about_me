import {Col, Divider, Row} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import block from 'bem-cn-lite';

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
        updateTitle,
        updatePriority,
        updateState,
        updateChecklist,
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
            case 'checklist':
                updateChecklist(initialData.id, newValue as any[]);
                break;
            case 'content':
                updateContent(initialData.id, newValue as string);
                break;
        }
    };

    const handleContentChange = (value: string) => {
        handleEnd('content', value);
    };

    return (
        <div className={b()}>
            <Divider orientation='left' orientationMargin={0}>
                <TodoTitle onEnd={handleEnd} content={initialData.title} />
            </Divider>
            <Row gutter={32} justify='end'>
                <Col>
                    {/* <Priority
                        priority={initialData.priority}
                        onUpdate={(priority: TodoPriority) =>
                            handleEnd('priority', priority)
                        }
                        isPending={isPending}
                    /> */}
                </Col>
                <Col>
                    {/* <State
                        state={initialData.state}
                        onUpdate={(state: TodoState) =>
                            handleEnd('state', state)
                        }
                        isPending={isPending}
                    /> */}
                </Col>
            </Row>
            <Row justify='end' align='top'>
                <Col xs={24} lg={16}>
                    <TextArea
                        className={b('content')}
                        defaultValue={initialData.content}
                        variant='borderless'
                        autoSize={{minRows: 6, maxRows: 24}}
                        onBlur={(e) => handleContentChange(e.target.value)}
                    />
                </Col>
                <Col xs={24} lg={8}>
                    <Checklist todoId={initialData.id} />
                </Col>
            </Row>
        </div>
    );
};
