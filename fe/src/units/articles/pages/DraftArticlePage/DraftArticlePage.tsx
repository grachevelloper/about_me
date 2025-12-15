import {
    Button,
    Col,
    Image,
    Input,
    notification,
    Row,
    theme,
    Typography,
} from 'antd';
import block from 'bem-cn-lite';
import {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';

import {MdEditor} from '@/shared/components/MdEditor';
import {useAuth} from '@/shared/context';
import {useDebouncedCallback} from '@/shared/hooks';
import {FIVE_SECONDS_IN_MS} from '@/shared/utils';

import {ArticleTag} from '../../components/ArticleTag';
import {useGetArticleById, useUpdateArticle} from '../../store';
import {Article, Tag} from '../../types';

import './DraftArticlePage.scss';

const b = block('draft-article-page');

export const DraftArticlePage = () => {
    const {user} = useAuth();
    const {
        token: {padding},
    } = theme.useToken();
    const {t} = useTranslation('article');
    const {t: tCommon} = useTranslation('common');
    const navigate = useNavigate();
    const {id: draftId} = useParams();
    const {error, isPending, mutateAsync: updateArticle} = useUpdateArticle();
    const {
        data: serverArticle,
        isLoading: isArticleLoading,
        error: articleError,
    } = useGetArticleById(draftId);
    const {title, content, updatedAt, tags, author, image} = serverArticle || {
        title: '',
        content: '',
        tags: [],
        id: '',
    };
    const [localArticle, setLocalArticle] = useState<Partial<Article> | null>(
        null
    );

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

    if (user?.id && author?.id && user?.id !== author?.id) {
        navigate('/error/no-permission');
    }
    console.log(localArticle?.content);

    return (
        <div className={b()} style={{padding}}>
            <Row>
                <Col span={24} md={16} sm={24}>
                    <Input
                        value={localArticle?.title}
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
                        alt={localArticle?.title}
                        style={{
                            width: '100%',
                            maxHeight: '400px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                        }}
                    />
                </Col>
            </Row>

            <Row style={{marginBottom: '24px'}} align='middle' gutter={[8, 8]}>
                <Col>
                    <span style={{marginRight: '8px', color: '#666'}}>
                        Теги:
                    </span>
                </Col>
                {localArticle?.tags?.map((tag: Tag) => (
                    <Col key={tag.id}>
                        <ArticleTag
                            name={tag.name}
                            // clsable
                            // onClose={() => {
                            //     const newTags =
                            //         localArticle.tags?.filter(
                            //             (t) => t.id !== tag.id
                            //         ) || [];
                            //     handleTagsChange(newTags);
                            // }}
                        />
                    </Col>
                ))}
                <Col>
                    <Button
                        size='small'
                        type='dashed'
                        onClick={() => {
                            const newTagName = prompt('Введите название тега:');
                            if (newTagName) {
                                const newTag: Tag = {
                                    id: Date.now().toString(),
                                    name: newTagName,
                                };
                                const newTags = [
                                    ...(localArticle?.tags || []),
                                    newTag,
                                ];
                                handleTagsChange(newTags);
                            }
                        }}
                    >
                        + Добавить тег
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <MdEditor
                        placeholder={t('article.placeholder')}
                        markdown={localArticle?.content || ''}
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
