import {Col, Row} from 'antd';
import block from 'bem-cn-lite';
import {lazy, Suspense} from 'react';

import {useTodosQuery} from '@/todos/store';

import {HelloTitle} from './components/HelloTitle';
import {Nowadays} from './components/Nowadays';
import {TodoListTable} from './components/TodoListTable';

import './MainPage.scss';

const AboutMe = lazy(() =>
    import('./components/AboutMe/index.js').then(({AboutMe}) => ({
        default: AboutMe,
    }))
);

const b = block('main-page');

export const MainPage = () => {
    const {data: todos} = useTodosQuery();

    return (
        <div className={b()}>
            <Row gutter={[24, 32]}>
                <Col span={24}>
                    <HelloTitle />
                </Col>
                <Col xs={24} xl={16}>
                    <TodoListTable todos={todos} />
                </Col>
                <Col xs={24} xl={8}>
                    <Nowadays />
                </Col>
                <Col span={24}>
                    <Suspense fallback={null}>
                        <AboutMe />
                    </Suspense>
                </Col>
            </Row>
        </div>
    );
};
