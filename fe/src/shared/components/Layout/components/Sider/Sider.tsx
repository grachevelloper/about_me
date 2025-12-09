import {BulbOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';
import {Flex, Layout, Menu} from 'antd';
import {MenuItemType} from 'antd/es/menu/interface';
import block from 'bem-cn-lite';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IoIosLogOut} from 'react-icons/io';
import {RiArticleLine} from 'react-icons/ri';
import {useNavigate} from 'react-router-dom';

import {useTodoForm} from '@/shared/context';

import {LogoutDialog} from '../LogoutDialog';

import './Sider.scss';

const b = block('sider');

const {Sider: AntSider} = Layout;

interface SiderProps {
    isCollapsed: boolean;
    setCollapsed: () => void;
}
export const Sider = ({isCollapsed, setCollapsed}: SiderProps) => {
    const {t} = useTranslation('common');
    const {setIsOpen} = useTodoForm();

    const navigate = useNavigate();

    const [isSignoutModalOpen, setSignoutModalOpen] = useState<boolean>(false);

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
            icon: <RiArticleLine />,
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
        {
            icon: <IoIosLogOut className={b('logout-icon')} />,
            label: t('logout'),
            key: 'action-1',
            onClick: () => setSignoutModalOpen(true),
            className: b('logout-option'),
        },
    ];

    return (
        <AntSider
            className={b()}
            breakpoint='lg'
            collapsedWidth={0}
            collapsed={isCollapsed}
            onCollapse={() => setCollapsed((prev) => !prev)}
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
                    selectable={false}
                    rootClassName={b('menu')}
                />
            </Flex>
            <LogoutDialog
                isOpen={isSignoutModalOpen}
                onCancel={() => setSignoutModalOpen(false)}
            />
        </AntSider>
    );
};
