import {Layout} from 'antd';
import {Content} from 'antd/es/layout/layout';
import block from 'bem-cn-lite';
import {useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';

import {checkAuth} from '../../api/checkAuth';

import './AuthLayout.scss';

const b = block('auth-layout');

export const AuthLayout = () => {
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
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to='/todos' replace />;
    }

    return (
        <Layout rootClassName={b()}>
            <Content className={b('content')}>
                <Outlet />
            </Content>
        </Layout>
    );
};
