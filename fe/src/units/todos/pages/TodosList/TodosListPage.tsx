import {Col, Row} from 'antd';

import {useTodosQuery} from '@/todos/store';

import {HelloTitle} from './components/HelloTitle';
import {Nowadays} from './components/Nowadays';
import {TodoListTable} from './components/TodoListTable';

export const TodosListPage = () => {
    const {data: todos} = useTodosQuery();
    return (
        <Row gutter={[32, 16]}>
            <Col span={24}>
                <HelloTitle />
            </Col>
            <Col xs={24} md={24} lg={12} xl={12}>
                <TodoListTable todos={todos} />
            </Col>
            <Row>
                <Col xs={24} md={24} lg={12} xl={12}>
                    <Nowadays />
                </Col>
            </Row>
        </Row>
    );
};
