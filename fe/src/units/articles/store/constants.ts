export const articleKeys = {
    all: ['articles'] as const,
    lists: () => [...articleKeys.all, 'list'] as const,
    list: (filters?: any) => [...articleKeys.lists(), {filters}] as const,
    details: () => [...articleKeys.all, 'detail'] as const,
    detail: (id: string) => [...articleKeys.details(), id] as const,
    drafts: (authorId: string) =>
        [...articleKeys.all, 'drafts', authorId] as const,
    byAuthor: (authorId: string) =>
        [...articleKeys.all, 'author', authorId] as const,
};

export const tagsKeys = {
    all: ['tags'] as const,
    lists: () => [...tagsKeys.all, 'list'] as const,
    list: () => [...tagsKeys.lists()] as const,
    details: () => [...tagsKeys.all, 'detail'] as const,
    detail: (id: string) => [...tagsKeys.details(), id] as const,
};
