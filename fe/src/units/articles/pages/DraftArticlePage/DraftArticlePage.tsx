import {MDXEditorMethods} from '@mdxeditor/editor';
import {Col, Image, Input, notification, Row, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';

import {MdEditor} from '@/shared/components/MdEditor';
import {useAuth} from '@/shared/context';
import {useDebouncedCallback} from '@/shared/hooks';
import {FIVE_SECONDS_IN_MS} from '@/shared/utils';

import {TagsSelect} from '../../components/TagsSelect';
import {TagsWrapper} from '../../components/TagsWrapper';
import {useGetArticleById, useUpdateArticle} from '../../store';
import {Article, Tag} from '../../types';

import './DraftArticlePage.scss';

const b = block('draft-article-page');

export const DraftArticlePage = () => {
    const {user} = useAuth();
    const mdRef = useRef<MDXEditorMethods>(null);
    const {
        token: {padding},
    } = theme.useToken();
    const {t} = useTranslation('article');
    const {t: tCommon} = useTranslation('common');
    const navigate = useNavigate();
    const {id: draftId} = useParams();
    // Use for mutate
    const {error, isPending, mutateAsync: updateArticle} = useUpdateArticle();
    //Use for first initial query
    const {
        data: serverArticle,
        isLoading: isArticleLoading,
        error: articleError,
    } = useGetArticleById(draftId);
    //Use for temporary state, between update by client and mutate
    const [localArticle, setLocalArticle] = useState<Partial<Article> | null>(
        null
    );
    const {title, content, updatedAt, tags, author, image} = localArticle || {
        title: '',
        content: '',
        tags: [],
        id: '',
    };

    useEffect(() => {
        if (!isArticleLoading && serverArticle) {
            setLocalArticle(serverArticle);
        }
    }, [serverArticle, isArticleLoading]);

    const debouncedUpdate = useDebouncedCallback(
        async (articleData: Partial<Article>) => {
            if (!draftId) return;

            try {
                await updateArticle({
                    id: draftId,
                    ...articleData,
                });

                notification.success({
                    message: t('article.draft.saved'),
                    placement: 'bottomRight',
                    duration: 2,
                });
            } catch (error) {
                notification.error({
                    message: t('article.draft.saveError'),
                    description: error as string,
                    placement: 'bottomRight',
                });
            }
        },
        FIVE_SECONDS_IN_MS,
        [draftId, updateArticle, t]
    );

    const handleTitleChange = useCallback(
        (title: string) => {
            setLocalArticle((prev) => {
                const updated = {...prev, title};
                debouncedUpdate(updated);
                return updated;
            });
        },
        [debouncedUpdate]
    );

    const handleContentChange = useCallback(
        (content: string) => {
            setLocalArticle((prev) => {
                const updated = {...prev, content};
                debouncedUpdate(updated);
                return updated;
            });
        },
        [debouncedUpdate]
    );

    const handleTagsChange = useCallback(
        (tags: Tag[]) => {
            setLocalArticle((prev) => {
                const updated = {...prev, tags};
                debouncedUpdate(updated);
                return updated;
            });
        },
        [debouncedUpdate]
    );

    useEffect(() => {
        if (!isArticleLoading && serverArticle?.content) {
            console.log(serverArticle.content);
            mdRef.current?.setMarkdown(serverArticle?.content || '');
        }
    }, [isArticleLoading, serverArticle?.content]);

    if (user?.id && author?.id && user?.id !== author?.id) {
        navigate('/error/no-permission');
    }

    return (
        <div className={b()} style={{padding}}>
            <Row>
                <Col span={24} md={16} sm={24}>
                    <Input
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder='Введите заголовок статьи'
                        variant='borderless'
                        style={{
                            fontSize: '32px',
                            fontWeight: 700,
                            padding: 0,
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                        }}
                    />
                </Col>
                {updatedAt && (
                    <Col className={b('updated-at')}>
                        <Typography.Title level={5}>
                            {tCommon('updated-at', {
                                date: new Date(updatedAt).toLocaleString(),
                            })}
                        </Typography.Title>
                    </Col>
                )}
            </Row>

            <Row style={{marginBottom: '24px'}}>
                <Col span={24}>
                    <Image
                        src={image}
                        alt={title}
                        style={{
                            width: '100%',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                        }}
                    />
                </Col>
            </Row>

            <Row align='middle' gutter={[8, 8]} style={{marginBottom: '12px'}}>
                <Col>{t('articles.form.tags.label')}</Col>
                <Col>
                    <TagsSelect onChange={handleTagsChange} value={tags} />
                </Col>
            </Row>
            <Row style={{marginBottom: '24px'}}>
                <Col>
                    <TagsWrapper
                        tags={tags}
                        editable={{onCreate: handleTagsChange}}
                        isPending={isPending}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <MdEditor
                        ref={mdRef}
                        placeholder={t('article.placeholder')}
                        markdown={content || ''}
                        onChange={handleContentChange}
                        editable
                        entityId={draftId || ''}
                        entityType='article'
                    />
                </Col>
            </Row>
        </div>
    );
};
