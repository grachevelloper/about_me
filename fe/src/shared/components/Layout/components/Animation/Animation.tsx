import {Flex, Statistic, StatisticProps} from 'antd';
import {valueType} from 'antd/es/statistic/utils';
import block from 'bem-cn-lite';
import {useRef} from 'react';
import CountUp from 'react-countup';

import {CURRENT_TIME, formatTime} from '@/shared/utils';

import {getRandomArbitrary, START_OF_DAY, TOTAL_DAY_DURATION} from './utils';

import './Animation.scss';

const b = block('animation');

const millisecondsSinceStartOfDay = CURRENT_TIME - START_OF_DAY;

const minutesSinceStartOfDay = millisecondsSinceStartOfDay / (1000 * 60) - 1;

const progress = (millisecondsSinceStartOfDay / TOTAL_DAY_DURATION) * 100;

const formatter: StatisticProps['formatter'] = (_value: valueType) => (
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
    const animatedRef = useRef<HTMLDivElement>(null);
    const pathLength = 400;
    let strokeDashoffset = pathLength - ((pathLength * progress) / 100) * 0.65;
    if (strokeDashoffset < 170) strokeDashoffset += 15;

    const qtdeEstrelas = 250;
    let estrela = '';
    const widthWindow = window.innerWidth;
    const heightWindow = window.innerHeight;

    const hours = new Date().getHours();
    const animatedObject = hours > 5 && hours < 18 ? true : false;

    const styleMods = ['style1', 'style2', 'style3', 'style4'];
    const sizeMods = ['size1', 'size1', 'size1', 'size2', 'size3'];
    const opacityMods = [
        'opacity1',
        'opacity1',
        'opacity1',
        'opacity2',
        'opacity2',
        'opacity3',
    ];

    for (let i = 0; i < qtdeEstrelas; i++) {
        if (animatedObject) break;

        const styleClass = b('star', {
            style: styleMods[getRandomArbitrary(0, 4)],
        });
        const sizeClass = b('star', {size: sizeMods[getRandomArbitrary(0, 5)]});
        const opacityClass = b('star', {
            opacity: opacityMods[getRandomArbitrary(0, 6)],
        });

        estrela +=
            `<span class="${b(
                'star'
            )} ${styleClass} ${sizeClass} ${opacityClass}" ` +
            `style="animation-delay: .${getRandomArbitrary(0, 9)}s; ` +
            `left: ${getRandomArbitrary(0, widthWindow)}px; ` +
            `top: ${getRandomArbitrary(0, heightWindow)}px;"></span>`;
    }

    if (animatedRef.current && !animatedObject) {
        animatedRef.current.innerHTML = `<div class="${b(
            'stars'
        )}">${estrela}</div>`;
    }

    return (
        <Flex
            vertical
            justify='center'
            align='center'
            rootClassName={b({night: !animatedObject, day: animatedObject})}
            gap={16}
        >
            <div
                ref={animatedRef}
                className={b('animated-object', {
                    stars: !animatedObject,
                    sun: animatedObject,
                })}
            >
                <div className={b('light')} />
            </div>
            <Statistic formatter={formatter} value={minutesSinceStartOfDay} />

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
                        } as React.CSSProperties
                    }
                />
            </svg>
        </Flex>
    );
};
