import {Col, Row} from 'antd';
import block from 'bem-cn-lite';

import {useTodosQuery} from '@/todos/store';

import {AboutMe} from './components/AboutMe';
import {HelloTitle} from './components/HelloTitle';
import {Nowadays} from './components/Nowadays';
import {TodoListTable} from './components/TodoListTable';
import './MainPage.scss';

const b = block('main-page');

export const MainPage = () => {
    const {data: todos} = useTodosQuery();
    return (
        <div className={b()}>
            <Row gutter={[16, 16]}>
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
                <Row>
                    <AboutMe />
                </Row>
            </Row>
        </div>
    );
};
