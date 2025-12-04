import {Button, notification, theme, Typography} from 'antd';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {LuCookie} from 'react-icons/lu';

import {useCookie} from '@/shared/hooks/useCookie';

import {ANIMATION__DURATION_IN_MS} from '../../constants';

const {Text} = Typography;

export const CookieMessage = () => {
    const {t} = useTranslation('common');
    const {token} = theme.useToken();
    const [api, contextHolder] = notification.useNotification();
    const {setValue} = useCookie('cookie-accept');
    const notificationKey = 'cookie-notification';

    const handleAccept = () => {
        setValue('true');
        api.destroy(notificationKey);
    };

    useEffect(() => {
        setTimeout(() => {
            api.open({
                key: notificationKey,
                message: (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: token.marginSM,
                        }}
                    >
                        <LuCookie
                            style={{
                                width: 80,
                                color: token.colorPrimary,
                            }}
                        />
                        <Text
                            strong
                            style={{color: token.colorText, margin: 0}}
                        >
                            {t('layout.cookie.accept')}
                        </Text>
                    </div>
                ),
                duration: 0,
                placement: 'bottomLeft',
                btn: (
                    <Button
                        type='primary'
                        size='small'
                        onClick={handleAccept}
                        style={{
                            background: token.colorPrimary,
                            borderColor: token.colorPrimary,
                            borderRadius: token.borderRadiusSM,
                            fontWeight: token.fontWeightStrong,
                        }}
                    >
                        {t('accept')}
                    </Button>
                ),
                style: {
                    width: 320,
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorder}`,
                    borderRadius: token.borderRadius,
                    boxShadow: token.boxShadowSecondary,
                    padding: `${token.paddingSM}px ${token.padding}px`,
                },
            });
        }, ANIMATION__DURATION_IN_MS);
        return () => {
            api.destroy(notificationKey);
        };
    }, [api, token]);

    return contextHolder;
};
