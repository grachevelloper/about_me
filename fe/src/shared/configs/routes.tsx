import {BrowserRouter, Route, RouteProps, Routes} from 'react-router-dom';

import {usersRoutes} from '@/users/pages';

import {articlesRoutes} from '@/articles/pages';
import {todosRoutes} from '@/todos/pages';

import {AuthLayout} from '../components/AuthLayout';
import {Layout} from '../components/Layout';
import {sharedPagesRoutes} from '../pages';
import {MainPage} from '../pages/MainPage';
import {ResumePage} from '../pages/ResumePage';

const routes: RouteProps[] = [
    ...todosRoutes,
    ...usersRoutes.slice(2),
    ...articlesRoutes,
];

const authRoutes: RouteProps[] = [...usersRoutes.slice(0, 2)];

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />} path='/'>
                    <Route index element={<MainPage />} />
                    <Route path='resume' element={<ResumePage />} />
                    {routes.map((route: RouteProps) => (
                        <Route
                            key={route.path}
                            element={route.element}
                            path={route.path}
                        />
                    ))}
                </Route>
                <Route element={<AuthLayout />} path='/auth'>
                    {authRoutes.map((route: RouteProps) => (
                        <Route
                            key={route.path}
                            element={route.element}
                            path={route.path}
                        />
                    ))}
                </Route>
                <Route path='/'>
                    {sharedPagesRoutes.map((route: RouteProps) => (
                        <Route
                            key={route.path}
                            element={route.element}
                            path={route.path}
                            index={route.index}
                        />
                    ))}
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
