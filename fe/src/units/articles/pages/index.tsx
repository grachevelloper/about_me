import {RouteProps} from 'react-router-dom';

import {ArticlePage} from './ArticlePage';
import {ArticlesListPage} from './ArticlesListPage';
import {DraftArticlePage} from './DraftArticlePage';
import {DraftsListPage} from './DraftsListPage';

export const articlesRoutes: RouteProps[] = [
    {
        path: 'articles',
        element: <ArticlesListPage />,
    },
    {
        path: 'articles/drafts',
        element: <DraftsListPage />,
    },
    {
        path: 'articles/draft/:id',
        element: <DraftArticlePage />,
    },
    {
        path: 'articles/:id',
        element: <ArticlePage />,
    },
];
