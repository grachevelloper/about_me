import {RouteProps} from 'react-router-dom';

import {SignInPage} from './SigninPage';
import {SignUpPage} from './SignupPage';
import {UserPage} from './UserPage';

export const usersRoutes: RouteProps[] = [
    {
        path: 'signin',
        element: <SignInPage />,
    },
    {
        path: 'signup',
        element: <SignUpPage />,
    },
    {
        path: 'user',
        element: <UserPage />,
    },
];
