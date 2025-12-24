import {RouteProps} from 'react-router-dom';

import {TodoDetailsPage} from './TodoDetails';

export const todosRoutes: RouteProps[] = [
    {
        path: 'todos/:id',
        element: <TodoDetailsPage />,
    },
];
