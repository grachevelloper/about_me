import {HomeOutlined} from '@ant-design/icons';
import {MenuItemType} from 'antd/es/menu/interface';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {RiArticleLine, RiDraftLine} from 'react-icons/ri';
import {useLocation, useNavigate} from 'react-router-dom';

import {Role} from '@/typings/common';

export const useNavigation = (userRole?: Role) => {
    const {t} = useTranslation('common');
    const navigate = useNavigate();
    const location = useLocation();

    const getNavigationItems = useCallback((): MenuItemType[] => {
        const baseItems: MenuItemType[] = [
            {
                icon: <HomeOutlined />,
                label: t('layout.top.main'),
                key: 'nav-0',
                onClick: () => navigate('/'),
            },
            {
                icon: <RiDraftLine />,
                label: t('layout.top.articles'),
                key: 'nav-1',
                onClick: () => navigate('/articles'),
            },
        ];

        const writerItems: MenuItemType[] = [
            {
                icon: <RiArticleLine />,
                label: t('layout.top.drafts'),
                key: 'nav-3',
                onClick: () => navigate('/articles/drafts'),
            },
        ];

        if (userRole === Role.ADMIN) {
            return [...baseItems, ...writerItems];
        } else if (userRole === Role.WRITER) {
            return [...baseItems, ...writerItems];
        }

        return baseItems;
    }, [t, navigate, userRole]);

    const getDefaultSelectedKey = useCallback((): string[] => {
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

    return {
        getNavigationItems,
        getDefaultSelectedKey,
    };
};
