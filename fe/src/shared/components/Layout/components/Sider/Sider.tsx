import {BulbOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';
import {Flex, Layout, Menu, theme} from 'antd';
import {MenuItemType} from 'antd/es/menu/interface';
import block from 'bem-cn-lite';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IoIosLogOut} from 'react-icons/io';
import {MdOutlineCreate} from 'react-icons/md';
import {RiArticleLine, RiDraftLine} from 'react-icons/ri';
import {useNavigate} from 'react-router-dom';

import {useAuth, useTodoForm} from '@/shared/context';
import {useLayout} from '@/shared/hooks';
import {Role} from '@/typings/common';

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
    const {user} = useAuth();
    const {isTablet, isMobile} = useLayout();
    const {setIsOpen} = useTodoForm();
    const {
        token: {fontSizeLG},
    } = theme.useToken();
    const navigate = useNavigate();

    const [isSignoutModalOpen, setSignoutModalOpen] = useState<boolean>(false);

    const isAdmin = user?.role === Role.ADMIN;
    const adminNaviage: MenuItemType[] = [
        {
            icon: <RiArticleLine />,
            label: t('layout.top.drafts'),
            key: 'nav-3',
            onClick: () => {
                navigate('/articles/drafts');
            },
        },
    ];

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
            icon: <RiDraftLine />,
            label: t('layout.top.articles'),
            key: 'nav-1',
            onClick: () => {
                navigate('/articles');
            },
        },
        ...(isAdmin ? adminNaviage : []),
    ];

    const userActions: MenuItemType[] = [
        {
            icon: <BulbOutlined />,
            label: t('layout.left.suggest'),
            key: 'action-user-0',
            onClick: () => {
                setIsOpen(true);
            },
        },
    ];

    const adminActions: MenuItemType[] = [
        {
            icon: <MdOutlineCreate />,
            label: t('layout.left.create_article'),
            key: 'action-admin-0',
            onClick: () => {
                navigate('/articles/new');
            },
        },
    ];

    const actionItems: MenuItemType[] = user
        ? [
              ...(isAdmin ? adminActions : userActions),
              {
                  icon: <IoIosLogOut className={b('logout-icon')} />,
                  label: t('logout'),
                  key: 'action-1',
                  onClick: () => setSignoutModalOpen(true),
                  className: b('logout-option'),
              },
          ]
        : [
              {
                  icon: <UserOutlined />,
                  label: t('layout.top.user.signup'),
                  key: 'nav-0',
                  onClick: () => {
                      navigate('/auth/signup');
                  },
              },
          ];

    const calculateWidth = () => {
        if (isTablet) return '25%';
        if (isMobile) return '250px';
        return '20%';
    };
    console.log(user);
    return (
        <AntSider
            className={b()}
            breakpoint='lg'
            collapsedWidth={0}
            collapsed={isCollapsed}
            onCollapse={() => setCollapsed((prev) => !prev)}
            theme='light'
            width={calculateWidth()}
            style={{
                maxWidth: '400px',
            }}
        >
            <Flex vertical justify='space-between' className={b('container')}>
                <Menu
                    theme='light'
                    mode='vertical'
                    items={navigateItems}
                    defaultSelectedKeys={['nav-0']}
                    rootClassName={b('menu')}
                    style={{
                        fontSize: fontSizeLG,
                    }}
                />

                <Menu
                    theme='light'
                    mode='vertical'
                    items={actionItems}
                    selectable={false}
                    rootClassName={b('menu')}
                    style={{
                        fontSize: fontSizeLG,
                    }}
                />
            </Flex>
            <LogoutDialog
                isOpen={isSignoutModalOpen}
                onCancel={() => setSignoutModalOpen(false)}
            />
        </AntSider>
    );
};
