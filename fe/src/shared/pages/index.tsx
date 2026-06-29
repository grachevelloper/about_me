import {RouteProps} from 'react-router-dom';

import {NoPermissionPage} from './NoPermissionPage';
import {NotFoundPage} from './NotFoundPage';

export const sharedPagesRoutes: RouteProps[] = [
    {
        path: 'no-permission',
        element: <NoPermissionPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];
