import {BulbOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';
import {Flex, Layout, Menu, message, notification, theme} from 'antd';
import {MenuItemType} from 'antd/es/menu/interface';
import block from 'bem-cn-lite';
import {Fragment, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IoIosLogOut} from 'react-icons/io';
import {MdOutlineCreate} from 'react-icons/md';
import {RiArticleLine, RiDraftLine, RiTodoLine} from 'react-icons/ri';
import {useLocation, useNavigate} from 'react-router-dom';

import {useAuth, useTodoForm} from '@/shared/context';
import {useLayout} from '@/shared/hooks';
import {Role} from '@/typings/common';

import {useCreateArticle} from '../../../../../units/articles/store';
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
    const location = useLocation();
    const [notificationApi, contextNotificationHolder] =
        notification.useNotification();
    const [messageApi, contextMessageHolder] = message.useMessage();

    const {
        mutateAsync: createArticle,
        data: newArticle,
        error: errorCraeteArticle,
        isPending: isPendingCreateingArticle,
    } = useCreateArticle();

    const [isSignoutModalOpen, setSignoutModalOpen] = useState<boolean>(false);

    const isWriter = user?.role === Role.WRITER;
    const isAdmin = user?.role === Role.ADMIN;
    const writerNavigate: MenuItemType[] = [
        {
            icon: <RiArticleLine />,
            label: t('layout.top.drafts'),
            key: 'nav-3',
            onClick: () => {
                navigate('/articles/drafts');
            },
        },
    ];

    const adminNavigate: MenuItemType[] = [];

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
    ];

    if (isAdmin) {
        navigateItems.push(...adminNavigate, ...writerNavigate);
    } else if (isWriter) {
        navigateItems.push(...writerNavigate);
    }

    const defaultNavigateItem = useCallback(() => {
        const path = location.pathname.split('/').at(-1);
        switch (path) {
            case 'todos':
                return ['nav-0'];
            case 'articles':
                return ['nav-1'];
            case 'user':
                return ['nav-2'];
            case 'drafts':
                return ['nav-3'];
            default:
                return [''];
        }
    }, [location]);

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

    const writerActions: MenuItemType[] = [
        {
            icon: <MdOutlineCreate />,
            label: t('layout.left.create_article'),
            key: 'action-writer-0',
            onClick: () => {
                createArticle()
                    .then((data) => {
                        navigate(`/articles/draft/${data.id}`);
                        messageApi.open({
                            type: 'success',
                            content: t(
                                'layout.left.create_article.success.title'
                            ),
                        });
                    })
                    .catch(() => {
                        notificationApi.error({
                            message: t(
                                'layout.left.create_article.error.title'
                            ),
                            description: t(
                                'layout.left.create_article.error.description'
                            ),
                        });
                    });
            },
        },
    ];

    const adminActions: MenuItemType[] = [
        {
            icon: <RiTodoLine />,
            label: t('layout.left.create_todo'),
            key: 'action-admin-0',
            onClick: () => {
                navigate('/todos/new');
            },
        },
    ];

    const actionItems: MenuItemType[] = user
        ? [
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

    if (isAdmin) {
        actionItems.unshift(...adminActions, ...writerActions);
    } else if (isWriter) {
        actionItems.unshift(...writerActions);
    } else {
        actionItems.unshift(...userActions);
    }

    const calculateWidth = () => {
        if (isTablet) return '25%';
        if (isMobile) return '250px';
        return '20%';
    };
    return (
        <Fragment>
            {contextNotificationHolder}
            {contextMessageHolder}
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
                <Flex
                    vertical
                    justify='space-between'
                    className={b('container')}
                >
                    <Menu
                        theme='light'
                        mode='vertical'
                        items={navigateItems}
                        defaultSelectedKeys={defaultNavigateItem()}
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
        </Fragment>
    );
};
