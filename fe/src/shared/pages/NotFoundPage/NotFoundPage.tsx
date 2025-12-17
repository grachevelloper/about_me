import {Space, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import Lottie from 'lottie-react';
import {useTranslation} from 'react-i18next';

import notFound from '@/public/lottie/not-found.json';

import {RevertButton} from '../../components/RevertButton';

import './NotFoundPage.scss';

const b = block('not-found-page');

export const NotFoundPage = () => {
    const {
        token: {},
    } = theme.useToken();
    const {t} = useTranslation('todo');
    return (
        <Space className={b()} direction='vertical'>
            <Lottie animationData={notFound} className={b('lottie')} />

            <Typography.Title>{t('not_found.page.title')}</Typography.Title>
            <RevertButton />
        </Space>
    );
};
