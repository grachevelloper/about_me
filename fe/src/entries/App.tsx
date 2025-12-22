import {QueryClientProvider} from '@tanstack/react-query';

import {queryClient} from '@/shared/configs/api';
import {Router} from '@/shared/configs/routes';
import {AuthProvider, ThemeProvider, TodoFormProvider} from '@/shared/context';

import {SidebarProvider} from '../shared/context/Sidebar';
import './App.scss';

function AppRouter() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <SidebarProvider>
                        <TodoFormProvider>
                            <Router />
                        </TodoFormProvider>
                    </SidebarProvider>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
export default AppRouter;
