import {Layout, Spin, theme} from 'antd';
import {Content} from 'antd/es/layout/layout';
import block from 'bem-cn-lite';
import {useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';

import authBackground from '@/public/assets/auth.jpeg';

import {checkAuth} from './api';
import {AuthNavigateButton} from './components/AuthNavigateButton';

import './AuthLayout.scss';

const b = block('auth-layout');
const authBackgroundUrl =
    process.env.NODE_ENV === 'development'
        ? '/assets/auth.jpeg'
        : authBackground;

export const AuthLayout = () => {
    const {
        token: {colorBgMask},
    } = theme.useToken();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsAuthenticated(authStatus);
        };

        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className={b('loader')}>
                <Spin size='large' />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to='/' replace />;
    }

    return (
        <Layout className={b()}>
            <img className={b('background')} src={authBackgroundUrl} alt='' />
            <div
                aria-hidden='true'
                className={b('backdrop')}
                style={{backgroundColor: colorBgMask}}
            />
            <Content className={b('content')}>
                <Outlet />
            </Content>
            <AuthNavigateButton />
        </Layout>
    );
};
