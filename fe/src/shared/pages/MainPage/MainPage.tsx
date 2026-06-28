import {BookOutlined, FileTextOutlined} from '@ant-design/icons';
import {Button, Card, Col, Flex, Row, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {useTodosQuery} from '@/todos/store';

import {HelloTitle} from './components/HelloTitle';
import {Nowadays} from './components/Nowadays';
import {TodoListTable} from './components/TodoListTable';

import './MainPage.scss';

const b = block('main-page');

export const MainPage = () => {
    const {t} = useTranslation('common');
    const {data: todos} = useTodosQuery();
    const navigate = useNavigate();
    const {
        token: {colorBgContainer, colorBorderSecondary, colorPrimaryBg},
    } = theme.useToken();

    return (
        <div className={b()}>
            <Row gutter={[24, 32]}>
                <Col span={24}>
                    <Card
                        className={b('hero')}
                        style={{
                            backgroundColor: colorBgContainer,
                            borderColor: colorBorderSecondary,
                        }}
                    >
                        <Flex
                            className={b('hero-inner')}
                            align='center'
                            justify='space-between'
                            gap={24}
                            wrap='wrap'
                        >
                            <div className={b('hero-copy')}>
                                <HelloTitle />
                                <Typography.Paragraph className={b('lead')}>
                                    {t('main.lead')}
                                </Typography.Paragraph>
                            </div>
                            <Flex className={b('actions')} gap={12} wrap='wrap'>
                                <Button
                                    type='primary'
                                    size='large'
                                    icon={<FileTextOutlined />}
                                    onClick={() => void navigate('/resume')}
                                >
                                    {t('layout.top.resume')}
                                </Button>
                                <Button
                                    size='large'
                                    icon={<BookOutlined />}
                                    onClick={() => void navigate('/articles')}
                                >
                                    {t('layout.top.articles')}
                                </Button>
                            </Flex>
                        </Flex>
                        <div
                            className={b('hero-accent')}
                            style={{backgroundColor: colorPrimaryBg}}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={16}>
                    <TodoListTable todos={todos} />
                </Col>
                <Col xs={24} xl={8}>
                    <Nowadays />
                </Col>
            </Row>
        </div>
    );
};
