import {HomeOutlined, LogoutOutlined} from '@ant-design/icons';
import {Layout, Menu, Tooltip} from 'antd';
import {MenuItemType} from 'antd/es/menu/interface';
import block from 'bem-cn-lite';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Navigate} from 'react-router-dom';

import {useLogoutMutation} from '@/users/hooks';

import './Header.scss';

const b = block('header');

const {Header: AntHeader} = Layout;

export const Header = () => {
    const {t} = useTranslation('common');
    const {mutateAsync, isPending, isError} = useLogoutMutation();
    const handleLogout = useCallback(async () => {
        await mutateAsync();
    }, []);

    const menuItems: MenuItemType[] = [
        {
            icon: <HomeOutlined />,
            label: t('layout.top.main'),
            key: 'nav-0',
            onClick: () => {
                <Navigate to='/todos' replace />;
            },
        },
    ];

    return (
        <AntHeader className={b()}>
            <Menu
                theme='light'
                mode='inline'
                items={menuItems}
                defaultSelectedKeys={[]}
                rootClassName={b('menu')}
            />
            <Tooltip title={t('logout')}>
                <LogoutOutlined
                    onClick={handleLogout}
                    className={b('logout-icon')}
                />
            </Tooltip>
        </AntHeader>
    );
};
