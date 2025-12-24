import {Carousel, Flex, Typography, theme} from 'antd';
import block from 'bem-cn-lite';
import Lottie from 'lottie-react';
import {useTranslation} from 'react-i18next';

import booksAnimation from '@/public/lottie/books.json';
import movieAnimation from '@/public/lottie/movie.json';
import musicAnimation from '@/public/lottie/music.json';

import './Nowadays.scss';

const b = block('nowadays');

type NowadaysData = {
    title: string;
    content: string;
    lottie?: object;
};

export const Nowadays = () => {
    const {t} = useTranslation('todo');
    const {
        token: {colorBgSpotlight, borderRadius, paddingMD, paddingSM},
    } = theme.useToken();
    const data: NowadaysData[] = [
        {
            title: t('todo.nowadays.book.title'),
            content: 'Лев Толстой - Воскресенье',
            lottie: booksAnimation,
        },
        {
            title: t('todo.nowadays.series.title'),
            content: '5 сезон Очень странные дела',
            lottie: movieAnimation,
        },
        {
            title: t('todo.nowadays.music.title'),
            content: 'Иногда - Моя мишель',
            lottie: musicAnimation,
        },
    ];
    return (
        <Carousel
            className={b()}
            draggable
            waitForAnimate
            style={{
                padding: paddingSM,
            }}
            autoplay
        >
            {data.map((one) => (
                <Flex
                    key={one.title}
                    vertical
                    gap={8}
                    className={b('block')}
                    justify='center'
                    align='start'
                    style={{
                        borderRadius: borderRadius,
                    }}
                >
                    {one?.lottie && (
                        <Lottie
                            animationData={one?.lottie}
                            loop={true}
                            className={b('lottie')}
                        />
                    )}
                    <Typography.Title
                        className={b('title')}
                        level={3}
                        style={{
                            padding: paddingMD,
                            backgroundColor: colorBgSpotlight,
                        }}
                    >
                        {one.title}
                    </Typography.Title>
                    <Typography.Text
                        className={b('content')}
                        style={{
                            padding: paddingMD,
                        }}
                    >
                        {one.content}
                    </Typography.Text>
                </Flex>
            ))}
        </Carousel>
    );
};
