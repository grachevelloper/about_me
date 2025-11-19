import {Flex} from 'antd';

import {useTodosQuery} from '@/todos/hooks';

import {HelloTitle} from './components/HelloTitle';
import {TodoListTable} from './components/TodoListTable';

export const TodosListPage = () => {
    const {data: todos} = useTodosQuery();
    return (
        <Flex vertical>
            <HelloTitle />
            <TodoListTable todos={todos} />
        </Flex>
    );
};
