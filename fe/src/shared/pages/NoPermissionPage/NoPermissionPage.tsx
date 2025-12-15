import {Flex, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import Lottie from 'lottie-react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import noPermission from '@/public/lottie/no-permission.json';

import {ButtonAccept} from '../../components/actions';

import './NoPermissionPage.scss';

const b = block('no-permission-page');

export const NoPermissionPage = () => {
    const {t} = useTranslation('common');
    const navigate = useNavigate();
    const {
        token: {},
    } = theme.useToken();
    return (
        <Flex className={b()} vertical gap={8} justify='center' align='center'>
            <Lottie
                animationData={noPermission}
                loop={true}
                className={b('lottie')}
            />
            <Typography.Title level={1}>
                {t('page.no_permission.title')}
            </Typography.Title>
            <ButtonAccept
                text={t('page.no_permission.button')}
                onClick={() => navigate(-1)}
            />
        </Flex>
    );
};
