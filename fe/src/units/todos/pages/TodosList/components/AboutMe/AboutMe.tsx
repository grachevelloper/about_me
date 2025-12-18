import {Col, Divider, Row, theme, Timeline, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {useTimeline} from '../../hooks';
import './AboutMe.scss';

const b = block('about-me');

export const AboutMe = () => {
    const {
        token: {},
    } = theme.useToken();
    const {t} = useTranslation('common');
    const {timelineItems} = useTimeline();
    console.log(timelineItems);
    return (
        <div className={b()}>
            <Row justify='center' align='middle'>
                <Col span={24}>
                    <Typography.Title level={1} className={b('title')}>
                        {t('about.title')}
                    </Typography.Title>
                    <Divider orientation='horizontal' />
                </Col>
            </Row>
            <Row>
                <Col xl={16} md={12}>
                    <Typography.Title level={2}>
                        {t('about.subitle')}
                    </Typography.Title>
                    <Typography.Title level={4}>
                        {t('about.description')}
                    </Typography.Title>
                </Col>
            </Row>

            <Row>
                <Col xl={16} md={12}>
                    <Typography.Title level={2}>
                        {t('about.work_experience')}
                    </Typography.Title>
                    <Timeline>
                        {timelineItems.map((item) => (
                            <Timeline.Item
                                key={item.index}
                                content={item.content}
                                title={item.title}
                                classNames={{
                                    icon: b('timeline-item-icon', {
                                        first: item.index === 0,
                                    }),
                                    content: b('timeline-item-content'),
                                    title: b('timeline-item-title'),
                                    rail: b('timeline-item-rail'),
                                    root: b('timeline-item'),
                                }}
                            ></Timeline.Item>
                        ))}
                    </Timeline>
                </Col>
            </Row>
        </div>
    );
};
