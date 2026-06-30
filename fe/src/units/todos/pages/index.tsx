import {RouteProps} from 'react-router-dom';

import {NewTodoPage} from './NewTodoPage';
import {TodoDetailsPage} from './TodoDetails';

export const todosRoutes: RouteProps[] = [
    {
        path: 'todos/new',
        element: <NewTodoPage />,
    },
    {
        path: 'todos/:id',
        element: <TodoDetailsPage />,
    },
];
