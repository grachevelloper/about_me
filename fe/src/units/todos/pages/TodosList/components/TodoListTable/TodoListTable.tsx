import {Flex, Table, Typography} from 'antd';
import {type ColumnsType} from 'antd/es/table';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import {Navigate} from 'react-router-dom';

import {Todo, TodoPriority, TodoState} from '@/todos/types';

import {PriorityCell} from './components/PriorityCell';
import {StateCell} from './components/StateCell';

const b = block('todo-list-table');

import './TodoListTable.scss';

interface TodoListTableProps {
    todos: Todo[];
}

type TodoTableColumns = Pick<Todo, 'title' | 'priority' | 'state' | 'id'>;

export const TodoListTable = ({todos}: TodoListTableProps) => {
    const {t} = useTranslation('todo');

    const columns: ColumnsType<TodoTableColumns> = [
        {
            key: 'title',
            title: t('todo.table.col.todo'),
            dataIndex: 'title',
        },
        {
            key: 'priority',
            title: t('todo.table.col.priority'),
            dataIndex: 'priority',
            render: (priority: TodoPriority, record: TodoTableColumns) => {
                return <PriorityCell priority={priority} todoId={record.id} />;
            },
            shouldCellUpdate(record, prevRecord) {
                return record.priority !== prevRecord.priority;
            },
        },
        {
            key: 'state',
            title: t('todo.table.col.state'),
            dataIndex: 'state',
            render: (state: TodoState, record: TodoTableColumns) => (
                <StateCell state={state} todoId={record.id} />
            ),
            shouldCellUpdate(record, prevRecord) {
                return record.state !== prevRecord.state;
            },
        },
    ];

    const handleRowClick = (index: string) => {
        return <Navigate to={`/todos/${index}`} replace />;
    };

    return (
        <Flex vertical rootClassName={b()}>
            <Typography.Title level={3}>
                {t('todo.table.title')}
            </Typography.Title>
            <Table<TodoTableColumns>
                rootClassName={b('table')}
                columns={columns}
                dataSource={todos}
                size='middle'
                rowClassName={b('row')}
                rowHoverable
                onRow={(record, _rowIndex) => {
                    return {
                        onClick: () => handleRowClick(record.id),
                    };
                }}
                scroll={{x: 'max-content', y: 55 * 5}}
            />
        </Flex>
    );
};
