import {Flex, Statistic, StatisticProps} from 'antd';
import block from 'bem-cn-lite';
import {type CSSProperties, useEffect, useMemo, useState} from 'react';
import CountUp from 'react-countup';

import {CURRENT_TIME, formatTime} from '@/shared/utils';

import {START_OF_DAY, TOTAL_DAY_DURATION} from './utils';

import './Animation.scss';

const b = block('animation');

const millisecondsSinceStartOfDay = CURRENT_TIME - START_OF_DAY;

const minutesSinceStartOfDay = millisecondsSinceStartOfDay / (1000 * 60) - 1;

const progress = (millisecondsSinceStartOfDay / TOTAL_DAY_DURATION) * 100;
const STAR_COUNT = 72;

const formatter: StatisticProps['formatter'] = () => (
    <CountUp
        className={b('time')}
        start={0}
        end={minutesSinceStartOfDay}
        key={minutesSinceStartOfDay}
        separator=''
        duration={4}
        formattingFn={formatTime}
        useEasing
    />
);

export const Animation = () => {
    const [isStopped, setStopped] = useState<boolean>(false);

    const pathLength = 400;
    let strokeDashoffset = pathLength - ((pathLength * progress) / 100) * 0.65;
    if (strokeDashoffset < 170) strokeDashoffset += 15;

    const hours = new Date().getHours();
    const isDay = hours > 5 && hours < 18 ? true : false;

    const stars = useMemo(
        () =>
            Array.from({length: STAR_COUNT}, (_, index) => ({
                id: index,
                left: `${(index * 37) % 100}%`,
                top: `${(index * 61) % 72}%`,
                delay: `${(index % 9) * 0.18}s`,
                scale: 0.7 + (index % 4) * 0.35,
                opacity: 0.24 + (index % 5) * 0.12,
            })),
        []
    );

    const handleClick = () => {
        setStopped(true);
    };

    useEffect(() => {
        if (window.location.pathname !== '/') {
            setStopped(true);
            return;
        }
    }, []);

    return (
        !isStopped && (
            <Flex
                vertical
                justify='center'
                align='center'
                rootClassName={b({night: !isDay, day: isDay})}
                gap={16}
                onClick={handleClick}
            >
                <div className={b('sky', {night: !isDay, day: isDay})}>
                    {!isDay && (
                        <div className={b('stars')} aria-hidden='true'>
                            {stars.map((star) => (
                                <span
                                    key={star.id}
                                    className={b('star')}
                                    style={
                                        {
                                            '--star-left': star.left,
                                            '--star-top': star.top,
                                            '--star-delay': star.delay,
                                            '--star-scale': star.scale,
                                            '--star-opacity': star.opacity,
                                        } as CSSProperties
                                    }
                                />
                            ))}
                        </div>
                    )}
                    {isDay && (
                        <>
                            <div className={b('sun')} />
                            <div className={b('light')} />
                        </>
                    )}
                </div>
                <Statistic
                    formatter={formatter}
                    value={minutesSinceStartOfDay}
                />

                <svg
                    className={b('animated-arc')}
                    viewBox='0 20 200 80'
                    preserveAspectRatio='xMidYMid meet'
                >
                    <defs>
                        <linearGradient
                            id='dayNightGradient'
                            x1='0%'
                            y1='0%'
                            x2='100%'
                            y2='0%'
                        >
                            <stop offset='0%' stopColor='#1a237e' />
                            <stop offset='20%' stopColor='#3949ab' />
                            <stop offset='40%' stopColor='#15bcd2ff' />
                            <stop offset='60%' stopColor='#1e92eaff' />
                            <stop offset='80%' stopColor='#3b0948ff' />
                            <stop offset='100%' stopColor='#090f4bff' />
                        </linearGradient>
                    </defs>

                    <path
                        className={b('arc-path')}
                        d='M 0,100 A 105,90 0 0,1 200,100'
                        fill='none'
                        style={
                            {
                                '--path-length': pathLength,
                                '--stroke-dashoffset': strokeDashoffset,
                            } as CSSProperties
                        }
                    />
                </svg>
            </Flex>
        )
    );
};
