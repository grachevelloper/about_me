import {createContext, ReactNode, useContext, useState} from 'react';

import {useLayout} from '../../hooks';

import {SidebarContextType} from './types';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({children}: {children: ReactNode}) => {
    const {isDesktop} = useLayout();
    const [isCollapsed, setCollapsed] = useState<boolean>(!isDesktop);

    const toggleCollapsed = () => {
        setCollapsed((prev) => !prev);
    };

    return (
        <SidebarContext.Provider
            value={{isCollapsed, setCollapsed, toggleCollapsed}}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
