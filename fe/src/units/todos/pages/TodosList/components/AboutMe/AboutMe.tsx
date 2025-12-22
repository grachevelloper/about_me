import type {TimelineItemProps} from 'antd';
import {Col, Divider, Image, Row, theme, Timeline, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {useTimeline, useSpecialization} from '../../hooks';
import './AboutMe.scss';

const b = block('about-me');

export const AboutMe = () => {
    const {t} = useTranslation('common');
    const {timelineItems} = useTimeline();
    const {specialization} = useSpecialization();
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);
    const {
        token: {colorPrimaryText, borderRadiusSM, borderRadius},
    } = theme.useToken();

    useEffect(() => {
        if (!timelineRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(
                            entry.target.getAttribute('data-index') || '0',
                            10
                        );
                        setVisibleItems((prev) =>
                            prev.includes(index) ? prev : [...prev, index]
                        );
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        const timelineElements =
            timelineRef.current.querySelectorAll('[data-index]');
        timelineElements.forEach((element) => {
            observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const renderTimelineItems: TimelineItemProps[] = useMemo(() => {
        return timelineItems.map((item, index) => ({
            key: item.index,
            content: (
                <div
                    data-index={index}
                    className={b('item-wrapper', {
                        visible: visibleItems.includes(index),
                    })}
                >
                    <Typography.Title
                        level={3}
                        style={{
                            marginBottom: 2,
                        }}
                    >
                        {item.content}
                    </Typography.Title>
                    <Typography.Text
                        data-index={index}
                        className={b('item-content', {
                            visible: visibleItems.includes(index),
                        })}
                    >
                        {item.title}
                    </Typography.Text>
                </div>
            ),
            classNames: {
                icon: b('item-icon', {
                    visible: visibleItems.includes(index),
                    [`delay-${index}`]: true,
                }),
                rail: b('item-rail', {
                    visible: visibleItems.includes(index),
                    [`delay-${index + 1}`]: true,
                }),
            },
            styles: {
                icon: {
                    color: colorPrimaryText,
                },
            },
        }));
    }, [timelineItems, visibleItems]);

    return (
        <div className={b()} ref={timelineRef}>
            <Row justify='center' align='middle'>
                <Col span={24}>
                    <Typography.Title level={1} className={b('title')}>
                        {t('about.title')}
                    </Typography.Title>
                    <Divider orientation='horizontal' />
                </Col>
            </Row>
            <Row justify='center'>
                <Col xl={16} md={12} sm={12}>
                    <Typography.Title level={2} className={b('subtitle')}>
                        {t('about.subtitle')}
                    </Typography.Title>
                </Col>
                <Col xl={8} md={12} sm={12} xs={20}>
                    <Image
                        src='/assets/me.png'
                        placeholder={t('about.photo')}
                        width='200'
                        styles={{
                            root: {
                                borderRadius,
                                padding: 4,
                                border: `2px solid ${colorPrimaryText}`,
                            },
                            image: {
                                borderRadius: borderRadiusSM,
                                filter: 'grayscale(20%)',
                            },
                        }}
                    />
                </Col>
            </Row>

            <Row justify='center' gutter={[16, 16]}>
                <Col xl={16} md={12} sm={12}>
                    <Typography.Title level={2}>
                        {t('about.work_experience')}
                    </Typography.Title>
                    <Timeline items={renderTimelineItems} />
                </Col>
                <Col xl={8} md={12} sm={12}>
                    <Typography.Title level={2}>
                        {t('about.work_experience')}
                    </Typography.Title>
                    <Timeline items={renderTimelineItems} />
                </Col>
            </Row>
        </div>
    );
};
