import {Layout} from 'antd';
import {Content} from 'antd/es/layout/layout';
import block from 'bem-cn-lite';
import {useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';

import {checkAuth} from './api';
import {AuthNavigateButton} from './components/AuthNavigateButton';

import './AuthLayout.scss';

const b = block('auth-layout');

export const AuthLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const navigate = useNavigate();

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
        navigate('/todos');
    }

    return (
        <Layout rootClassName={b()}>
            <Content className={b('content')}>
                <Outlet />
            </Content>
            <AuthNavigateButton />
        </Layout>
    );
};
