import {Flex, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import Lottie from 'lottie-react';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import noInternet from '@/public/lottie/no-internet.json';

import './OfflineOverlay.scss';

const b = block('offline-overlay');

export const OfflineOverlay = () => {
    const {
        token: {},
    } = theme.useToken();
    const {t} = useTranslation('common');

    useEffect(() => {
        document.body.classList.add('no-scroll');

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);
    return (
        <Flex vertical justify='center' align='center' className={b()}>
            <Typography.Title
                level={1}
                style={{
                    color: 'white',
                }}
            >
                {t('no_internet.title')}
            </Typography.Title>

            <Typography.Title
                level={5}
                style={{
                    color: 'white',
                }}
            >
                {t('no_internet.description')}
            </Typography.Title>
            <Lottie
                animationData={noInternet}
                loop={true}
                className={b('lottie')}
            />
        </Flex>
    );
};
