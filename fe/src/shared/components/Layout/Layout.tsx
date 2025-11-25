import {BulbOutlined} from '@ant-design/icons';
import {QueryErrorResetBoundary} from '@tanstack/react-query';
import {Layout as AntLayout, Button, Menu, theme} from 'antd';
import {MenuItemType} from 'antd/es/menu/interface';
import block from 'bem-cn-lite';
import {ErrorBoundary} from 'react-error-boundary';
import {useTranslation} from 'react-i18next';
import {Outlet} from 'react-router-dom';

import {useTodoForm} from '../../context';
import {NewTodoForm} from '../NewTodoForm';

import './Layout.scss';
import {Header} from './components/Header';

const b = block('layout');

const {Content, Sider} = AntLayout;

export const Layout = () => {
    const {t} = useTranslation('common');
    const {setIsOpen} = useTodoForm();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const leftItems: MenuItemType[] = [
        {
            icon: <BulbOutlined />,
            label: t('layout.left.suggest'),
            key: 'action-0',
            onClick: () => {
                setIsOpen(true);
            },
        },
    ];

    return (
        <QueryErrorResetBoundary>
            {({reset}) => (
                <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({resetErrorBoundary}) => (
                        <div>
                            There was an error!
                            <Button onClick={() => resetErrorBoundary()}>
                                Try again
                            </Button>
                        </div>
                    )}
                >
                    <AntLayout rootClassName={b()}>
                        <NewTodoForm />
                        <Header />
                        <AntLayout>
                            <Sider
                                breakpoint='lg'
                                collapsedWidth='0'
                                theme='light'
                            >
                                <Menu
                                    theme='light'
                                    mode='inline'
                                    items={leftItems}
                                />
                            </Sider>
                            <Content className={b('content')}>
                                <Outlet />
                            </Content>
                        </AntLayout>
                    </AntLayout>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
};
