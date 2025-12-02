import {QueryErrorResetBoundary} from '@tanstack/react-query';
import {Layout as AntLayout, Button, theme} from 'antd';
import block from 'bem-cn-lite';
import {useEffect} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {Outlet} from 'react-router-dom';

import {useAuth} from '../../context';
import {NewTodoForm} from '../NewTodoForm';

import {isMe} from './api';
import {Animation} from './components/Animation';
import {Sider} from './components/Sider';

import './Layout.scss';

const b = block('layout');

const {Content} = AntLayout;

export const Layout = () => {
    const {setUserData} = useAuth();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    useEffect(() => {
        const getUser = async () => {
            const user = await isMe();
            setUserData(user);
        };
        getUser();
    }, []);

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
                    <Animation />
                    <AntLayout rootClassName={b()} hasSider>
                        <NewTodoForm />
                        {/* <Image
                            src='/assets/title.png'
                            height={90}
                            style={{objectFit: 'contain'}}
                            rootClassName={b('title')}
                            preview={false}
                        /> */}
                        {/* <Tooltip title={t('logout')}>
                <LogoutOutlined
                    onClick={handleLogout}
                    className={b('logout-icon')}
                />
            </Tooltip> */}
                        <Sider />
                        <Content className={b('content')}>
                            <Outlet />
                        </Content>
                    </AntLayout>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
};
