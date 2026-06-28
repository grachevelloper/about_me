import type {TimelineItemProps} from 'antd';
import {
    Col,
    Divider,
    Flex,
    Image,
    Row,
    theme,
    Timeline,
    Typography,
} from 'antd';
import block from 'bem-cn-lite';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {useLayout} from '../../../../hooks';
import {useSpecialization, useTimeline} from '../../hooks';

import './AboutMe.scss';

const b = block('about-me');

export const AboutMe = () => {
    const {t} = useTranslation('common');
    const {timelineItems} = useTimeline();
    const {specialization} = useSpecialization();
    const [visibleTimeineItems, setVisibleTimelineItems] = useState<number[]>(
        []
    );
    const [isSpecializationVisible, setIsSpecializationVisible] =
        useState(false);
    const specializationRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const {
        token: {colorPrimaryText, borderRadiusSM, borderRadius},
    } = theme.useToken();
    const {isMobile} = useLayout();

    useEffect(() => {
        const timelineElements =
            timelineRef.current?.querySelectorAll('[data-index]');
        const specializationElement = specializationRef.current;

        if (!timelineElements && !specializationElement) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const dataIndex =
                            entry.target.getAttribute('data-index');

                        if (dataIndex) {
                            const index = parseInt(dataIndex, 10);
                            setVisibleTimelineItems((prev) =>
                                prev.includes(index) ? prev : [...prev, index]
                            );
                        } else if (entry.target === specializationElement) {
                            setIsSpecializationVisible(true);
                        }
                    }
                });
            },
            {threshold: 0.9}
        );

        timelineElements?.forEach((el) => observer.observe(el));
        if (specializationElement) observer.observe(specializationElement);

        return () => observer.disconnect();
    }, []);

    const renderTimelineItems: TimelineItemProps[] = useMemo(() => {
        return timelineItems.map((item, index) => ({
            key: item.index,
            content: (
                <div
                    data-index={index}
                    className={b('timeline-item-wrapper', {
                        visible: visibleTimeineItems.includes(index),
                    })}
                >
                    <Typography.Title level={3} style={{marginBottom: 2}}>
                        {item.content}
                    </Typography.Title>
                    <Typography.Text
                        data-index={index}
                        className={b('timeline-item-content', {
                            visible: visibleTimeineItems.includes(index),
                        })}
                    >
                        {item.title}
                    </Typography.Text>
                </div>
            ),
            classNames: {
                icon: b('timeline-item-icon', {
                    visible: visibleTimeineItems.includes(index),
                    [`delay-${index}`]: true,
                }),
                rail: b('timeline-item-rail', {
                    visible: visibleTimeineItems.includes(index),
                    [`delay-${index + 1}`]: true,
                }),
            },
            styles: {
                icon: {
                    color: colorPrimaryText,
                },
            },
        }));
    }, [timelineItems, visibleTimeineItems]);

    const renderSpecializationItems = useCallback(() => {
        return specialization.map((spec, specIndex) => (
            <Flex
                vertical
                justify='center'
                align='center'
                gap={6}
                key={spec.segmentTitle}
                className={b('spec', {
                    visible: isSpecializationVisible,
                    [`delay-${specIndex}`]: true,
                })}
            >
                <Typography.Title level={3}>
                    {spec.segmentTitle}
                </Typography.Title>
                <Flex justify='space-around' className={b('skills-wrapper')}>
                    {spec.segment.map((skill, skillIndex) => (
                        <Flex
                            gap={6}
                            key={skill.title}
                            vertical
                            align='center'
                            justify='center'
                            className={b('skill')}
                        >
                            <Image
                                src={skill.icon}
                                width={isMobile ? 64 : 80}
                                height={isMobile ? 64 : 80}
                                preview={false}
                                className={b('image-skill-root', {
                                    visible: isSpecializationVisible,
                                    [`skill-delay-${specIndex}`]: true,
                                    [`direction-${skillIndex + 1}-${
                                        specIndex + 1
                                    }`]: true,
                                })}
                            />
                            <Typography.Title
                                level={5}
                                className={b('skill-title', {
                                    visible: isSpecializationVisible,
                                    [`skill-title-delay-${skillIndex}`]: true,
                                })}
                            >
                                {skill.title}
                            </Typography.Title>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        ));
    }, [specialization, isSpecializationVisible]);

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
            <Row justify='center' gutter={[32, 32]} className={b('intro')}>
                <Col xl={16} md={14} xs={24}>
                    <Typography.Title level={2} className={b('subtitle')}>
                        {t('about.subtitle')}
                    </Typography.Title>
                </Col>
                <Col xl={8} md={10} xs={24} className={b('photo-column')}>
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
                <Col xl={16} md={14} sm={14} xs={24}>
                    <Typography.Title
                        level={1}
                        className={b('specialization-title')}
                    >
                        {t('about.specialization.title')}
                    </Typography.Title>
                    <Flex
                        ref={specializationRef}
                        justify='space-around'
                        align='center'
                        vertical
                    >
                        {renderSpecializationItems()}
                    </Flex>
                </Col>
                <Col xl={8} md={10} xs={24} className={b('timeline-column')}>
                    <Flex
                        vertical
                        align='center'
                        justify='center'
                        style={{height: '100%'}}
                    >
                        <Timeline items={renderTimelineItems} />
                    </Flex>
                </Col>
            </Row>
        </div>
    );
};
