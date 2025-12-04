import {BulbOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';
import {Flex, Layout, Menu} from 'antd';
import {MenuItemType} from 'antd/es/menu/interface';
import block from 'bem-cn-lite';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {PiArticleNyTimesThin} from 'react-icons/pi';
import {useNavigate} from 'react-router-dom';

import {useTodoForm} from '@/shared/context';
import {useLogoutMutation} from '@/users/store';

import './Sider.scss';

const b = block('sider');

const {Sider: AntSider} = Layout;

export const Sider = () => {
    const {t} = useTranslation('common');
    const {setIsOpen} = useTodoForm();
    const {mutate, isPending, isError} = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        mutate();
    }, []);

    const navigateItems: MenuItemType[] = [
        {
            icon: <HomeOutlined />,
            label: t('layout.top.main'),
            key: 'nav-0',
            onClick: () => {
                navigate('/todos');
            },
        },
        {
            icon: <UserOutlined />,
            label: t('layout.top.user'),
            key: 'nav-2',
            onClick: () => {
                navigate('/user');
            },
        },
        {
            icon: <PiArticleNyTimesThin />,
            label: t('layout.top.articles'),
            key: 'nav-3',
            onClick: () => {
                navigate('/articles');
            },
        },
    ];

    const actionItems: MenuItemType[] = [
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
        <AntSider
            className={b()}
            breakpoint='lg'
            collapsedWidth='0'
            theme='light'
        >
            <Flex vertical justify='space-between' className={b('container')}>
                <Menu
                    theme='light'
                    mode='vertical'
                    items={navigateItems}
                    defaultSelectedKeys={[]}
                    rootClassName={b('menu')}
                />

                <Menu
                    theme='light'
                    mode='vertical'
                    items={actionItems}
                    defaultSelectedKeys={[]}
                    rootClassName={b('menu')}
                />
            </Flex>
        </AntSider>
    );
};
