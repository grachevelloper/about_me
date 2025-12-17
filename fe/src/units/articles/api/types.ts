import {Article, Tag} from '../types';

export type DtoCreateArticle = Pick<Article, 'title' | 'content'>;

export type DtoUpdateArticle = Partial<
    Pick<Article, 'title' | 'content' | 'image' | 'readTime' | 'tags' | 'id'>
>;

export interface ArticleApi {
    create: (createData: DtoCreateArticle) => Promise<Article>;
    update: (updateData: DtoUpdateArticle) => Promise<Article>;
    delete: (id: string) => Promise<void>;
    getById: (id: string) => Promise<Article>;
    getDrafts: () => Promise<Article[]>;
    getByAuthorId: (authorId: string) => Promise<Article[]>;
    getAll: () => Promise<Article[]>;
    publish: (id: string) => Promise<boolean>;
}

export interface TagsApi {
    getTags: () => Promise<Tag[]>;
    createTag: (name: string) => Promise<Tag>;
    deleteTag: (id: string) => Promise<boolean>;
    updateTag: (id: string, newName: string) => Promise<Tag>;
}
