import {FloatButton, Popover, Typography, notification, theme} from 'antd';
import block from 'bem-cn-lite';
import {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RiLoginCircleLine} from 'react-icons/ri';
import {VscAccount} from 'react-icons/vsc';
import {useLocation, useNavigate} from 'react-router-dom';

import './AuthNavigateButton.scss';

const b = block('auth-navigate-button');

type NavigateData = {
    icon: React.ReactNode | null;
    link: string;
    text: string;
    title: string;
};

export const AuthNavigateButton = () => {
    const {t} = useTranslation('auth');
    const {
        token: {borderRadius, paddingSM},
    } = theme.useToken();
    const [isNotificationShown, setIsNotificationShown] = useState(false);
    const [showFloatButton, setShowFloatButton] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const getLinkData = useCallback((): NavigateData => {
        const endOfPath = location.pathname.split('/').at(-1);
        switch (endOfPath) {
            case 'signin':
                return {
                    icon: <VscAccount />,
                    link: '/auth/signup',
                    title: t('auth.signin.notification.title'),
                    text: t('auth.signin.notification.description'),
                };
            case 'signup':
                return {
                    icon: <RiLoginCircleLine />,
                    link: '/auth/signin',
                    text: t('auth.signup.notification.description'),
                    title: t('auth.signup.notification.title'),
                };
            default:
                return {
                    icon: null,
                    link: '',
                    text: '',
                    title: '',
                };
        }
    }, [location, t]);

    const {link, text, title, icon} = getLinkData();

    useEffect(() => {
        if (!link || isNotificationShown) return;

        api.open({
            message: (
                <Typography.Title
                    className={b('title')}
                    style={{
                        paddingLeft: paddingSM,
                    }}
                    level={5}
                >
                    {title}
                </Typography.Title>
            ),
            description: (
                <Typography.Link
                    className={b('link')}
                    onClick={() => {
                        navigate(link);
                        api.destroy();
                    }}
                    style={{fontWeight: 500, paddingLeft: paddingSM}}
                >
                    {text}
                </Typography.Link>
            ),
            placement: 'bottomRight',
            duration: 1000,
            onClose: () => {
                setIsNotificationShown(true);
                setShowFloatButton(true);
            },

            style: {
                width: 270,
                borderRadius,
                padding: paddingSM,
            },
            className: b(),
        });

        const timer = setTimeout(() => {
            if (!isNotificationShown) {
                setIsNotificationShown(true);
                setShowFloatButton(true);
            }
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [link, isNotificationShown, api, navigate, title, text]);

    if (!link) {
        return null;
    }

    return (
        <>
            {contextHolder}

            {showFloatButton && (
                <Popover
                    trigger='hover'
                    content={
                        <Typography.Link
                            onClick={() => navigate(link)}
                            style={{fontWeight: 500}}
                        >
                            {text}
                        </Typography.Link>
                    }
                    arrow
                    placement='left'
                    overlayStyle={{maxWidth: 200}}
                >
                    <FloatButton
                        icon={icon}
                        style={{
                            transition: 'opacity 0.3s ease-in-out',
                            animation: 'floatButtonAppear 0.5s ease-out',
                        }}
                    />
                </Popover>
            )}

            <style>
                {`
                    @keyframes floatButtonAppear {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </>
    );
};
