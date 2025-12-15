import {RouteProps} from 'react-router-dom';

import {NoPermissionPage} from './NoPermissionPage';

export const sharedPagesRoutes: RouteProps[] = [
    {
        path: 'no-permission',
        element: <NoPermissionPage />,
    },
];
