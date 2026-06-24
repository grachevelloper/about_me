import {ConfigProvider} from 'antd';
import React, {createContext} from 'react';

import {CustomThemeConfig, ThemeMode, themes} from '../../configs/styles';
import {useLocalStorage} from '../../hooks/useLocalStorage';

interface ThemeContextType {
    theme: CustomThemeConfig;
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
    children,
}) => {
    const [themeMode, setThemeMode] = useLocalStorage<ThemeMode>(
        'theme',
        'light'
    );

    const theme = themes[themeMode];

    const value: ThemeContextType = {
        theme,
        themeMode,
        setThemeMode,
    };

    return (
        <ThemeContext.Provider value={value}>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </ThemeContext.Provider>
    );
};
