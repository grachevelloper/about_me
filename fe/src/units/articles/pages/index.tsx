import {RouteProps} from 'react-router-dom';

import {ArticlePage} from './ArticlePage';
import {ArticlesListPage} from './ArticlesListPage';

export const articlesRoutes: RouteProps[] = [
    {
        path: 'articles',
        element: <ArticlesListPage />,
    },
    {
        path: 'articles/:id',
        element: <ArticlePage />,
    },
];
