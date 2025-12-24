import {MDXEditorMethods} from '@mdxeditor/editor';
import {Col, Dropdown, Image, Input, Row, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';

import {ButtonAccept} from '@/shared/components/actions';
import {MdEditor} from '@/shared/components/MdEditor';
import {useAuth} from '@/shared/context';
import {useSidebar} from '@/shared/context/Sidebar';
import {useDebouncedCallback} from '@/shared/hooks';
import {FIVE_SECONDS_IN_MS} from '@/shared/utils';

import {TagsSelect} from '../../components/TagsSelect';
import {TagsWrapper} from '../../components/TagsWrapper';
import {ViewModeToggle} from '../../components/ViewModeToggle';
import {useUpdateErrors} from '../../hooks/useErrorHandler';
import {useGetArticleById, useUpdateArticle} from '../../store';
import {Article, Tag, UpdateDraftField} from '../../types';

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
    const {isCollapsed} = useSidebar();

    const {
        updateTitle,
        updateContent,
        updateTags,
        updateImage,
        updateReadTime,
        updateDraftStatus,
    } = useUpdateArticle();

    // Для первого запроса
    const {
        data: serverArticle,
        isLoading: isArticleLoading,
        error: articleError,
    } = useGetArticleById(draftId);

    // Локальное состояние
    const [localArticle, setLocalArticle] = useState<Partial<Article> | null>(
        null
    );
    const {title, content, updatedAt, tags, author, image} = localArticle || {
        title: '',
        content: '',
        tags: [],
        id: '',
    };

    const {error: errorUpdatingContent, mutateAsync: mutateContent} =
        updateContent;

    const {error: errorUpdatingTitle, mutateAsync: mutateTitle} = updateTitle;

    const {
        error: errorPublish,
        isPending: isPublishingPending,
        mutateAsync: mutatePublishDraft,
    } = updateDraftStatus;

    const {
        error: errorUpdatingReadTime,
        isPending: isReadTimePending,
        mutateAsync: mutateReadTime,
    } = updateReadTime;

    const {
        error: errorUpdatingImage,
        isPending: isImagePending,
        mutateAsync: mutateImage,
    } = updateImage;

    const updateErrors = {
        title: !!errorUpdatingTitle,
        content: !!errorUpdatingContent,
        tags: !!updateTags.error,
        image: !!errorUpdatingImage,
        readTime: !!errorUpdatingReadTime,
        isDraft: !!errorPublish,
    };

    const errorFields: UpdateDraftField[] = Object.entries(updateErrors)
        .filter(([_, hasError]) => hasError)
        .map(([field]) => field as UpdateDraftField);

    const contextHolder = useUpdateErrors(errorFields);

    useEffect(() => {
        if (!isArticleLoading && serverArticle) {
            setLocalArticle(serverArticle);
        }
    }, [serverArticle, isArticleLoading]);

    const debouncedUpdateTitle = useDebouncedCallback(
        async (title: string) => {
            if (!draftId) return;

            await mutateTitle(draftId, title);
        },
        FIVE_SECONDS_IN_MS,
        [draftId, updateTitle, t]
    );

    const debouncedUpdateContent = useDebouncedCallback(
        async (content: string) => {
            if (!draftId) return;

            await mutateContent(draftId, content);
        },
        FIVE_SECONDS_IN_MS,
        [draftId, updateContent, t]
    );

    const handleTagsChange = useCallback(
        async (newTags: Tag[]) => {
            if (!draftId) return;
            setLocalArticle((prev) => ({...prev, tags: newTags}));
            await updateTags.mutateAsync(draftId, newTags);
        },
        [draftId, updateTags, t]
    );

    const handleImageChange = useCallback(
        async (newImage: string) => {
            if (!draftId) return;

            setLocalArticle((prev) => ({...prev, image: newImage}));
            await mutateImage(draftId, newImage);
        },
        [draftId, updateTags, t]
    );

    const handleReadTimeChange = useDebouncedCallback(
        async (newReadTime: number) => {
            if (!draftId) return;

            setLocalArticle((prev) => ({...prev, readTime: newReadTime}));
            await mutateReadTime(draftId, newReadTime);
        },
        FIVE_SECONDS_IN_MS,
        [draftId, updateTags, t]
    );

    const handleTitleChange = useCallback(
        (newTitle: string) => {
            setLocalArticle((prev) => ({...prev, title: newTitle}));
            debouncedUpdateTitle(newTitle);
        },
        [debouncedUpdateTitle]
    );

    const handleContentChange = useCallback(
        (newContent: string) => {
            setLocalArticle((prev) => ({...prev, content: newContent}));
            debouncedUpdateContent(newContent);
        },
        [debouncedUpdateContent]
    );

    const handlePublish = useCallback(async () => {
        if (draftId) {
            await mutatePublishDraft(draftId, false);
        }
    }, [draftId]);

    useEffect(() => {
        if (!isArticleLoading && serverArticle?.content) {
            mdRef.current?.setMarkdown(serverArticle?.content || '');
        }
    }, [isArticleLoading, serverArticle?.content]);

    const isSaving = false;

    if (user?.id && author?.id && user?.id !== author?.id) {
        navigate('/no-permission');
    }

    return (
        <div className={b({reading: isCollapsed})} style={{padding}}>
            {contextHolder}

            <ViewModeToggle />
            <Row>
                <Col span={24} md={16} sm={24}>
                    <Input
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder='Введите заголовок статьи'
                        variant='borderless'
                        disabled={updateTitle.isPending}
                        style={{
                            fontSize: '32px',
                            fontWeight: 700,
                            opacity: updateTitle.isPending ? 0.7 : 1,
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
                <Dropdown arrow trigger={['hover']}>
                    {t('article.options')}
                </Dropdown>
            </Row>

            <Row style={{margin: '24px 0'}}>
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
                        editable={{onChange: handleTagsChange}}
                        isPending={updateTags.isPending}
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
                        readOnly={updateContent.isPending}
                    />
                </Col>
            </Row>
            <Row justify='end'>
                <Col>
                    <ButtonAccept
                        text={t('article.draft.pushlish')}
                        loading={isPublishingPending}
                        onClick={handlePublish}
                        className={b('button-publish')}
                    />
                </Col>
            </Row>
        </div>
    );
};
