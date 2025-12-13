import {Grid} from 'antd';

const {useBreakpoint} = Grid;

export const useLayout = () => {
    const screens = useBreakpoint();

    return {
        isMobile: !screens.md,
        isTablet: Boolean(screens.md && !screens.lg),
        isDesktop: Boolean(screens.lg || screens.xl),
    };
};
