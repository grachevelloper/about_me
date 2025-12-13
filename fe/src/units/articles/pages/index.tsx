import {RouteProps} from 'react-router-dom';

import {ArticlePage} from './ArticlePage';
import {ArticlesListPage} from './ArticlesListPage';
import {CreateArticlePage} from './CreateArticlePage';

export const articlesRoutes: RouteProps[] = [
    {
        path: 'articles',
        element: <ArticlesListPage />,
    },
    {
        path: 'articles/new',
        element: <CreateArticlePage />,
    },
    {
        path: 'articles/:id((?!new[^/]+))',
        element: <ArticlePage />,
    },
];
