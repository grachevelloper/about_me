import {ThemeConfig} from 'antd';

export interface CustomThemeConfig extends ThemeConfig {
    name: 'light' | 'dark';
}

export type ThemeMode = 'light' | 'dark';

const CARD = {
    bodyPadding: 20,
    bodyPaddingSM: 8,
    headerFontSize: 20,
    headerFontSizeSM: 16,
    headerPadding: 20,
    headerPaddingSM: 8,
    actionsLiMargin: '8px auto 16px 0',
};

const BUTTON_PADDING = {
    paddingBlock: 8,
    paddingBlockLG: 14,
    paddingBlockSM: 2,
    paddingInline: 20,
    paddingInlineLG: 20,
    paddingInlineSM: 10,
};

const lightTheme: CustomThemeConfig = {
    name: 'light',
    token: {
        colorPrimary: '#e8b4a9',
        colorSuccess: '#a8d5ba',
        colorWarning: '#f5d6ba',
        colorError: '#e8a9b4',
        colorInfo: '#a9b4e8',

        colorBgBase: '#fefaf6',
        colorBgContainer: '#fdf5f0',
        colorBgElevated: '#fcf0e6',

        colorTextBase: '#5d4037',
        colorTextSecondary: '#8d6e63',
        colorTextTertiary: '#a1887f',
        colorTextQuaternary: '#bcaaa4',

        colorBorder: '#d7ccc8',
        colorBorderSecondary: '#e0e0e0',

        borderRadius: 8,
        fontSize: 14,
        lineHeight: 1.5715,

        colorPrimaryBg: '#f9f0eb',
        colorPrimaryBorder: '#e8b4a9',
        colorBgLayout: '#fefaf6',
    },
    components: {
        Layout: {
            headerBg: '#fefaf6',
            bodyBg: '#fefaf6',
            siderBg: '#fdf5f0',
            triggerBg: '#f5d6ba',
            triggerColor: '#5d4037',
        },
        Input: {
            colorBgContainer: 'transparent',
            hoverBorderColor: '#e8b4a9',
            activeBorderColor: '#e8b4a9',
            colorText: '#5d4037',
            colorTextPlaceholder: '#a1887f',
        },
        Button: {
            ...BUTTON_PADDING,
            colorPrimary: '#e8b4a9',
            colorPrimaryHover: '#d4a299',
            colorPrimaryActive: '#c09189',
            colorText: '#5d4037',
        },
        Card: {
            ...CARD,
            colorBgContainer: '#fdf5f0',
            colorBorder: '#d7ccc8',
        },
        Menu: {
            colorBgContainer: '#faebe1ff',
            itemBg: '#ecc4acff',
            itemSelectedBg: '#f8bf8dff',
            itemColor: '#5d4037',
            itemSelectedColor: '#5d4037',
        },
        Table: {
            colorBgContainer: '#fdf5f0',
            colorBorderSecondary: '#d7ccc8',
            colorFillAlter: '#f9f0eb',
        },
    },
};

const darkTheme: CustomThemeConfig = {
    name: 'dark',
    token: {
        colorPrimary: '#d4a299',
        colorSuccess: '#8dc4a8',
        colorWarning: '#d4b8a8',
        colorError: '#d499a3',
        colorInfo: '#999fd4',

        colorBgBase: '#2a211c',
        colorBgContainer: '#352a24',
        colorBgElevated: '#40332c',

        colorTextBase: '#e8d5c9',
        colorTextSecondary: '#d4c0b4',
        colorTextTertiary: '#c0ab9f',
        colorTextQuaternary: '#ac968a',

        colorBorder: '#5d4a3f',
        colorBorderSecondary: '#6d5a4f',

        borderRadius: 8,
        fontSize: 14,
        lineHeight: 1.5715,

        colorPrimaryBg: '#3a2d26',
        colorPrimaryBorder: '#d4a299',
        colorBgLayout: '#2a211c',
    },
    components: {
        Layout: {
            headerBg: '#2a211c',
            bodyBg: '#2a211c',
            siderBg: '#352a24',
            triggerBg: '#40332c',
            triggerColor: '#e8d5c9',
        },
        Input: {
            colorBgContainer: '#352a24',
            hoverBorderColor: '#d4a299',
            activeBorderColor: '#d4a299',
            colorText: '#e8d5c9',
            colorTextPlaceholder: '#c0ab9f',
        },
        Button: {
            ...BUTTON_PADDING,
            colorPrimary: '#d4a299',
            colorPrimaryHover: '#c09189',
            colorPrimaryActive: '#ac8079',
            colorText: '#2a211c',
        },
        Card: {
            ...CARD,
            colorBgContainer: '#352a24',
            colorBorder: '#5d4a3f',
        },
        Menu: {
            colorBgContainer: '#352a24',
            itemBg: '#352a24',
            itemSelectedBg: '#d4a299',
            itemColor: '#ffd5baff',
            itemSelectedColor: '#2a211c',
        },
        Table: {
            colorBgContainer: '#352a24',
            colorBorderSecondary: '#5d4a3f',
            colorFillAlter: '#3a2d26',
        },
    },
};

export const themes: Record<ThemeMode, CustomThemeConfig> = {
    light: lightTheme,
    dark: darkTheme,
};
