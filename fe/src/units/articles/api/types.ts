import {Article, Tag} from '../types';

export type DtoCreateArticle = Pick<Article, 'title' | 'content'>;

export type DtoUpdateArticle = Partial<
    Pick<Article, 'title' | 'content' | 'image' | 'readTime' | 'tags' | 'id'>
>;

export type DtoUpdateArticleTitle = Pick<Article, 'id' | 'title'>;
export type DtoUpdateArticleContent = Pick<Article, 'id' | 'content'>;
export type DtoUpdateArticleImage = Pick<Article, 'id' | 'image'>;
export type DtoUpdateArticleReadTime = Pick<Article, 'id' | 'readTime'>;
export type DtoUpdateArticleTags = Pick<Article, 'id' | 'tags'>;
export type DtoUpdateArticleDraftStatus = Pick<Article, 'id' | 'isDraft'>;

export type DtoCreateTag = Omit<Tag, 'id'>;

export interface ArticleApi {
    create: (createData: DtoCreateArticle) => Promise<Article>;
    update: (updateData: DtoUpdateArticle) => Promise<Article>;

    updateTitle: (data: DtoUpdateArticleTitle) => Promise<Article>;
    updateContent: (data: DtoUpdateArticleContent) => Promise<Article>;
    updateImage: (data: DtoUpdateArticleImage) => Promise<Article>;
    updateReadTime: (data: DtoUpdateArticleReadTime) => Promise<Article>;
    updateTags: (data: DtoUpdateArticleTags) => Promise<Article>;
    updateDraftStatus: (data: DtoUpdateArticleDraftStatus) => Promise<Article>;

    delete: (id: string) => Promise<void>;
    getById: (id: string) => Promise<Article>;
    getDrafts: () => Promise<Article[]>;
    getByAuthorId: (authorId: string) => Promise<Article[]>;
    getAll: () => Promise<Article[]>;
    publish: (id: string) => Promise<boolean>;
}

export interface TagsApi {
    getTags: () => Promise<Tag[]>;
    createTag: (data: DtoCreateTag) => Promise<Tag>;
    deleteTag: (id: string) => Promise<boolean>;
}
