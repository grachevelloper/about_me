import {QueryErrorResetBoundary} from '@tanstack/react-query';
import {Layout as AntLayout, Button, theme} from 'antd';
import block from 'bem-cn-lite';
import {useEffect, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {MdOutlineMenuOpen} from 'react-icons/md';
import {Outlet, useLocation} from 'react-router-dom';

import {useAuth} from '../../context';
import {useCookie} from '../../hooks/useCookie';
import {useLayout} from '../../hooks/useLayout';
import {NewTodoForm} from '../NewTodoForm';

import {isMe} from './api';
import {Animation} from './components/Animation';
import {CookieMessage} from './components/CookieMessage';
import {OfflineOverlay} from './components/OfflineOverlay';
import {Sider} from './components/Sider';

import './Layout.scss';

const b = block('layout');

const {Content} = AntLayout;

export const Layout = () => {
    const {setUserData} = useAuth();
    const location = useLocation();
    const {isTablet, isMobile, isDesktop} = useLayout();

    const {value} = useCookie('cookie-accept');
    const [isCollapsed, setCollapsed] = useState<boolean>(!isDesktop);

    const isOffline = !window.navigator.onLine;

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const handleCollapse = () => {
        setCollapsed((prev) => !prev);
    };

    useEffect(() => {
        const getUser = async () => {
            const user = await isMe();
            setUserData(user);
        };
        getUser();
    }, []);

    useEffect(() => {
        if (!isCollapsed && !isDesktop) {
            setCollapsed(true);
        }
    }, [location.pathname]);

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
                    {isOffline && <OfflineOverlay />}
                    <Animation />
                    <AntLayout className={b()} hasSider>
                        {!isCollapsed && !isDesktop && (
                            <div
                                className={b('overlay')}
                                onClick={handleCollapse}
                            />
                        )}
                        <NewTodoForm />
                        {!value && <CookieMessage />}

                        {isCollapsed && (
                            <MdOutlineMenuOpen
                                size={30}
                                className={b('sider-collapse-button')}
                                onClick={handleCollapse}
                            />
                        )}
                        <Sider
                            setCollapsed={handleCollapse}
                            isCollapsed={isCollapsed}
                        />
                        <Content className={b('content')}>
                            <Outlet />
                        </Content>
                    </AntLayout>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
};
