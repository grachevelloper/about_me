import React, {createContext, useContext, useState} from 'react';

import {type User} from '@/users/types';

import {UserContextType, UserVoid} from './types';

const AuthContext = createContext<UserContextType>(UserVoid);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
    children,
}) => {
    const [user, setUserData] = useState<User | undefined>();

    const value = {
        user,
        setUserData,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): UserContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
