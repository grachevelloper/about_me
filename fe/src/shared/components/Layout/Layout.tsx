import {QueryErrorResetBoundary} from '@tanstack/react-query';
import {Layout as AntLayout, Button, Flex, theme} from 'antd';
import block from 'bem-cn-lite';
import {useEffect} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {useTranslation} from 'react-i18next';
import {MdOutlineMenuOpen} from 'react-icons/md';
import {Outlet, useLocation} from 'react-router-dom';

import {useAuth} from '../../context';
import {useSidebar} from '../../context/Sidebar';
import {useCookie} from '../../hooks/useCookie';
import {useLayout} from '../../hooks/useLayout';
import {NewTodoForm} from '../NewTodoForm';

import {isMe} from './api';
import {Animation} from './components/Animation';
import {CookieMessage} from './components/CookieMessage';
import {Footer} from './components/Footer';
import {OfflineOverlay} from './components/OfflineOverlay';
import {Sider} from './components/Sider';

import './Layout.scss';

const b = block('layout');

const {Content} = AntLayout;

export const Layout = () => {
    const {t} = useTranslation('common');
    const {setUserData} = useAuth();
    const location = useLocation();
    const {isDesktop} = useLayout();
    const {value} = useCookie('cookie-accept');
    const {isCollapsed, toggleCollapsed, setCollapsed} = useSidebar();

    const isOffline = !window.navigator.onLine;

    const {
        token: {colorPrimary, colorTextLightSolid},
    } = theme.useToken();

    useEffect(() => {
        const getUser = async () => {
            const user = await isMe();
            setUserData(user);
        };
        getUser();
    }, []);

    useEffect(() => {
        if (!isDesktop) {
            setCollapsed(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        setCollapsed(!isDesktop);
    }, [isDesktop]);

    return (
        <QueryErrorResetBoundary>
            {({reset}) => (
                <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({resetErrorBoundary}) => (
                        <Flex>
                            {/* <Lottie animationData={}></Lottie> */}
                            <Button onClick={() => resetErrorBoundary()}>
                                Try to refresh page
                            </Button>
                        </Flex>
                    )}
                >
                    {isOffline && <OfflineOverlay />}
                    <Animation />
                    <AntLayout className={b()} hasSider>
                        {!isCollapsed && !isDesktop && (
                            <div
                                className={b('overlay')}
                                onClick={toggleCollapsed}
                            />
                        )}
                        {isCollapsed && (
                            <Button
                                type='text'
                                className={b('sider-collapse-button')}
                                onClick={toggleCollapsed}
                                aria-label={t('layout.navigation.open')}
                                style={{
                                    backgroundColor: colorPrimary,
                                    color: colorTextLightSolid,
                                }}
                                icon={<MdOutlineMenuOpen size={28} />}
                            />
                        )}

                        <NewTodoForm />
                        {!value && <CookieMessage />}

                        <Sider />
                        <Content className={b('content')}>
                            <Outlet />
                            <Footer />
                        </Content>
                    </AntLayout>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
};
