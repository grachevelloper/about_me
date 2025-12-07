import {Tag as AntTag, Col, Divider, Image, Row, theme, Typography} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {CommentsWrapper} from '@/shared/components/CommentsWrapper';

import {type Article, type Tag} from '@/articles/types';

import './ArticlePage.scss';

const b = block('article-page');

const {Title, Text} = Typography;

export const ArticlePage = () => {
    const {t} = useTranslation('article');
    const {
        token: {borderRadius, colorBorder, colorPrimary, colorTextSecondary},
    } = theme.useToken();

    const initialData: Article = {
        id: '1',
        title: t('Древний рим в новое время'),
        createdAt: '15 мая 2024',
        likesCount: 89,
        content: 'ПОПОАОАО',
        comments: [],
        tags: [{id: '1', name: 'react'}],
        readTime: 3,
        image: 'https://picsum.photos/400/250?random=1',
    };
    const handleEnd = () =>
        // newValueType: T,
        // newValue: Article[T]
        {
            // Здесь будет логика обновления данных статьи
            // console.log('Update:', newValueType, newValue);
        };

    const handleContentChange = (value: string) => {
        // handleEnd('content', value);
    };

    const handleTitleChange = (value: string) => {
        // handleEnd('title', value);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={b()}>
            {/* Заголовок статьи */}
            <Divider orientation='left' orientationMargin={0}>
                <Title
                    level={1}
                    editable={{
                        onChange: handleTitleChange,
                        triggerType: ['text'],
                    }}
                    style={{marginBottom: 0}}
                >
                    {initialData.title}
                </Title>
            </Divider>

            {/* Мета-информация */}
            <Row
                gutter={32}
                justify='space-between'
                align='middle'
                style={{marginBottom: 24}}
            >
                <Col>
                    <Row gutter={16} align='middle'>
                        {initialData.readTime && (
                            <Col>
                                <Text type='secondary' style={{fontSize: 14}}>
                                    {t('article.readTime', {
                                        minutes: initialData.readTime,
                                    })}
                                </Text>
                            </Col>
                        )}
                        {initialData.updatedAt && (
                            <Col>
                                <Text type='secondary' style={{fontSize: 14}}>
                                    {t('article.updatedAt', {
                                        date: formatDate(initialData.updatedAt),
                                    })}
                                </Text>
                            </Col>
                        )}
                        {initialData.createdAt && (
                            <Col>
                                <Text type='secondary' style={{fontSize: 14}}>
                                    {t('article.createdAt', {
                                        date: formatDate(initialData.createdAt),
                                    })}
                                </Text>
                            </Col>
                        )}
                    </Row>
                </Col>
                <Col>
                    <Row gutter={8} align='middle'>
                        <Col>
                            <Text strong style={{color: colorPrimary}}>
                                {initialData.likesCount}
                            </Text>
                        </Col>
                        <Col>
                            <Text type='secondary' style={{fontSize: 14}}>
                                {t('article.likes')}
                            </Text>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Изображение статьи */}
            {initialData.image && (
                <Row style={{marginBottom: 32}}>
                    <Col span={24}>
                        <Image
                            src={initialData.image}
                            alt={initialData.title}
                            style={{
                                width: '100%',
                                maxHeight: 400,
                                objectFit: 'cover',
                                borderRadius: borderRadius,
                                border: `1px solid ${colorBorder}`,
                            }}
                            preview={false}
                        />
                    </Col>
                </Row>
            )}

            {/* Теги */}
            {initialData.tags.length > 0 && (
                <Row gutter={8} style={{marginBottom: 32}}>
                    <Col>
                        <Text strong style={{marginRight: 8}}>
                            {t('article.tags')}:
                        </Text>
                    </Col>
                    {initialData.tags.map((tag: Tag) => (
                        <Col key={tag.id}>
                            <AntTag
                                color={colorPrimary}
                                style={{
                                    borderRadius: borderRadius,
                                    border: `1px solid ${colorBorder}`,
                                }}
                            >
                                {tag.name}
                            </AntTag>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Содержимое статьи */}
            <Row style={{marginBottom: 32}}>
                <Col span={24}>
                    <TextArea
                        className={b('content')}
                        defaultValue={initialData.content}
                        variant='borderless'
                        autoSize={{minRows: 10, maxRows: 50}}
                        onBlur={(e) => handleContentChange(e.target.value)}
                        style={{
                            border: `2px solid ${colorBorder}`,
                            borderRadius: borderRadius,
                            padding: 16,
                            fontSize: 16,
                            lineHeight: 1.6,
                        }}
                    />
                </Col>
            </Row>

            <Divider orientation='left' orientationMargin={0}>
                <Title level={3} style={{marginBottom: 0}}>
                    {t('article.comments')} ({initialData.comments.length})
                </Title>
            </Divider>

            <Row>
                <Col span={24}>
                    <CommentsWrapper
                        entityId={initialData.id || ''}
                        entityType='article'
                    />
                </Col>
            </Row>
        </div>
    );
};
