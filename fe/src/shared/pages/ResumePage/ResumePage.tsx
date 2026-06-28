import {
    BookOutlined,
    CalendarOutlined,
    CodeOutlined,
    IdcardOutlined,
    ReadOutlined,
} from '@ant-design/icons';
import {Card, Flex, Image, Tag, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import './ResumePage.scss';

type ResumeItem = {
    company?: string;
    description?: string;
    period: string;
    title: string;
};

type SkillGroup = {
    items: string[];
    title: string;
};

const b = block('resume-page');

export const ResumePage = () => {
    const {t} = useTranslation('common');
    const {
        token: {
            colorBgContainer,
            colorBgElevated,
            colorBorderSecondary,
            colorPrimary,
            colorPrimaryBg,
            colorTextSecondary,
        },
    } = theme.useToken();

    const experience = useMemo<ResumeItem[]>(
        () => [
            {
                title: t('resume.experience.avito.title'),
                company: t('resume.experience.avito.company'),
                period: t('about.timeline.avi.date'),
                description: t('about.timeline.avi.content'),
            },
            {
                title: t('resume.experience.yandex.title'),
                company: t('resume.experience.yandex.company'),
                period: t('about.timeline.ya.date'),
                description: t('about.timeline.ya.content'),
            },
        ],
        [t]
    );

    const education = useMemo<ResumeItem[]>(
        () => [
            {
                title: t('resume.education.mirea.title'),
                company: t('resume.education.mirea.company'),
                period: t('about.timeline.uni.date'),
            },
        ],
        [t]
    );

    const skills = useMemo<SkillGroup[]>(
        () => [
            {
                title: t('skill.frontend'),
                items: [
                    'React',
                    'TypeScript',
                    'Angular',
                    'HTML',
                    'CSS / SCSS',
                    'REST API',
                    'Deeplinks',
                ],
            },
            {
                title: t('skill.backend'),
                items: [
                    'Go',
                    'Node.js',
                    'Express',
                    'NestJS',
                    'PostgreSQL',
                    'SQL',
                ],
            },
            {
                title: t('skill.infrastructure'),
                items: ['Docker', 'Nginx', 'TeamCity', 'Git', 'Linux'],
            },
            {
                title: t('skill.observability'),
                items: ['Grafana', 'Sentry', 'Redash', 'Logging', 'Monitoring'],
            },
            {
                title: t('skill.ai'),
                items: [
                    'Claude',
                    'Codex',
                    'Prompt engineering',
                    'Technical writing',
                ],
            },
            {
                title: t('skill.team'),
                items: ['Agile', 'Jira', 'Confluence'],
            },
        ],
        [t]
    );

    const sectionStyle = {
        backgroundColor: colorBgContainer,
        borderColor: colorBorderSecondary,
    };

    return (
        <main className={b()}>
            <section
                className={b('hero')}
                style={{
                    backgroundColor: colorBgContainer,
                    borderColor: colorBorderSecondary,
                }}
            >
                <div className={b('avatar-wrap')}>
                    <Image
                        src='/assets/me.png'
                        alt={t('about.photo')}
                        preview={false}
                        className={b('avatar')}
                    />
                </div>
                <div className={b('hero-content')}>
                    <Typography.Title level={2} className={b('title')}>
                        {t('resume.name')}
                    </Typography.Title>
                    <Typography.Text
                        className={b('role')}
                        style={{color: colorPrimary}}
                    >
                        {t('resume.role')}
                    </Typography.Text>
                    <Typography.Paragraph
                        className={b('summary')}
                        style={{color: colorTextSecondary}}
                    >
                        {t('about.subtitle')}
                    </Typography.Paragraph>
                </div>
            </section>

            <section className={b('section')}>
                <Flex align='center' gap={10} className={b('section-heading')}>
                    <IdcardOutlined style={{color: colorPrimary}} />
                    <Typography.Title level={2}>
                        {t('about.work_experience')}
                    </Typography.Title>
                </Flex>
                <div className={b('timeline')}>
                    {experience.map((item) => (
                        <article
                            className={b('timeline-item')}
                            key={item.period}
                        >
                            <div
                                className={b('dot')}
                                style={{backgroundColor: colorPrimary}}
                            />
                            <div className={b('timeline-content')}>
                                <Flex
                                    align='baseline'
                                    gap={12}
                                    wrap='wrap'
                                    className={b('item-head')}
                                >
                                    <Typography.Title level={3}>
                                        {item.title}
                                    </Typography.Title>
                                    {item.company && (
                                        <Typography.Text
                                            strong
                                            style={{color: colorPrimary}}
                                        >
                                            {item.company}
                                        </Typography.Text>
                                    )}
                                    <Typography.Text
                                        className={b('period')}
                                        style={{color: colorTextSecondary}}
                                    >
                                        <CalendarOutlined /> {item.period}
                                    </Typography.Text>
                                </Flex>
                                <Typography.Paragraph
                                    className={b('description')}
                                    style={{color: colorTextSecondary}}
                                >
                                    {item.description}
                                </Typography.Paragraph>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className={b('section')}>
                <Flex align='center' gap={10} className={b('section-heading')}>
                    <ReadOutlined style={{color: colorPrimary}} />
                    <Typography.Title level={2}>
                        {t('resume.education.title')}
                    </Typography.Title>
                </Flex>
                {education.map((item) => (
                    <Card
                        key={item.period}
                        className={b('education-card')}
                        style={sectionStyle}
                    >
                        <Typography.Title level={4}>
                            {item.title}
                        </Typography.Title>
                        {item.company && (
                            <Typography.Text
                                strong
                                className={b('education-company')}
                                style={{color: colorPrimary}}
                            >
                                {item.company}
                            </Typography.Text>
                        )}
                        {item.description && (
                            <Typography.Paragraph
                                className={b('description')}
                                style={{color: colorTextSecondary}}
                            >
                                {item.description}
                            </Typography.Paragraph>
                        )}
                        <Typography.Text
                            className={b('period')}
                            style={{color: colorTextSecondary}}
                        >
                            <CalendarOutlined /> {item.period}
                        </Typography.Text>
                    </Card>
                ))}
            </section>

            <section className={b('section')}>
                <Flex align='center' gap={10} className={b('section-heading')}>
                    <BookOutlined style={{color: colorPrimary}} />
                    <Typography.Title level={2}>
                        {t('about.specialization.title')}
                    </Typography.Title>
                </Flex>
                <div className={b('skills-grid')}>
                    {skills.map((group) => (
                        <Card
                            key={group.title}
                            className={b('skill-card')}
                            style={{
                                backgroundColor: colorBgElevated,
                                borderColor: colorBorderSecondary,
                            }}
                        >
                            <Flex
                                align='center'
                                gap={8}
                                className={b('skill-card-title')}
                            >
                                <CodeOutlined style={{color: colorPrimary}} />
                                <Typography.Text
                                    strong
                                    className={b('skill-title')}
                                    style={{color: colorTextSecondary}}
                                >
                                    {group.title}
                                </Typography.Text>
                            </Flex>
                            <Flex gap={8} wrap='wrap'>
                                {group.items.map((skill) => (
                                    <Tag
                                        key={skill}
                                        className={b('skill-tag')}
                                        style={{
                                            backgroundColor: colorPrimaryBg,
                                            borderColor: colorBorderSecondary,
                                        }}
                                    >
                                        {skill}
                                    </Tag>
                                ))}
                            </Flex>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
};
