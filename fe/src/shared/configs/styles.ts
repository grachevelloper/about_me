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
        colorPrimary: '#9ca3af', // Стальной серый
        colorSuccess: '#10b981', // Изумрудный (для контраста)
        colorWarning: '#f59e0b', // Янтарный
        colorError: '#ef4444', // Алый
        colorInfo: '#3b82f6', // Синий

        colorBgBase: '#ffffff', // Чистый белый
        colorBgContainer: '#f9fafb', // Серебристо-белый
        colorBgElevated: '#ffffff', // Блестящий белый
        colorBgLayout: '#f8fafc', // Ледяной белый

        colorBgMask: 'rgba(0, 0, 0, 0.1)', // Маска/оверлей
        colorBgBlur: 'rgba(255, 255, 255, 0.85)', // Размытый фон
        colorBgSpotlight: 'rgba(222, 223, 223, 0.95)', // Подсветка

        colorTextBase: '#1f2937', // Темный графит
        colorTextSecondary: '#4b5563', // Средний графит
        colorTextTertiary: '#6b7280', // Светлый графит
        colorTextQuaternary: '#9ca3af', // Серебристый серый

        colorBorder: '#d1d5db', // Светло-серая граница
        colorBorderSecondary: '#e5e7eb', // Очень светлая серебристая

        borderRadius: 8,
        fontSize: 14,
        lineHeight: 1.5715,

        colorPrimaryBg: '#f3f4f6', // Серебристый фон для primary
        colorPrimaryBorder: '#d1d5db', // Серебристая граница
    },
    components: {
        Layout: {
            headerBg: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            bodyBg: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            siderBg: '#f9fafb',
            triggerBg: '#e5e7eb',
            triggerColor: '#1f2937',
        },
        Input: {
            colorBgContainer: '#ffffff',
            hoverBorderColor: '#9ca3af',
            activeBorderColor: '#6b7280',
            colorText: '#1f2937',
            colorTextPlaceholder: '#9ca3af',
            activeShadow: '0 0 0 2px rgba(156, 163, 175, 0.2)',
        },
        Button: {
            ...BUTTON_PADDING,
            colorPrimary: '#ffffff',
            colorPrimaryHover: '#f9fafb',
            colorPrimaryActive: '#f3f4f6',
            colorText: '#1f2937',
            defaultShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
            primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.05)',
            defaultBg: 'linear-gradient(145deg, #ffffff 0%, #f3f4f6 100%)',
            defaultBorderColor: '#d1d5db',
            primaryorderColor: '#9ca3af',
        },
        Card: {
            ...CARD,
            colorBgContainer: '#ffffff',
            colorBorder: '#e5e7eb',
            boxShadow:
                '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
            boxShadowSecondary:
                '0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
        },
        Menu: {
            colorBgContainer: '#f9fafb',
            itemHoverBg: '#e5e7eb',
            itemBg: '#f9fafb',
            itemSelectedBg: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)',
            itemColor: '#1f2937',
            itemSelectedColor: '#1f2937',
            itemActiveBg: 'linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%)',
        },
        Table: {
            colorBgContainer: '#ffffff',
            colorBorderSecondary: '#e5e7eb',
            colorFillAlter: '#f9fafb',
            colorFillSecondary: '#f3f4f6',
            headerBg: '#f9fafb',
            headerSplitColor: '#e5e7eb',
            rowHoverBg: '#f3f4f6',
        },
        Typography: {
            colorTextHeading: '#111827',
            colorText: '#1f2937',
            colorTextSecondary: '#4b5563',
            colorTextDescription: '#6b7280',
        },
        Divider: {
            colorSplit: '#e5e7eb',
        },
        Tabs: {
            colorBgContainer: '#ffffff',
            colorBorderSecondary: '#e5e7eb',
            itemSelectedColor: '#1f2937',
            inkBarColor: '#9ca3af',
        },
    },
};

const darkTheme: CustomThemeConfig = {
    name: 'dark',
    token: {
        colorPrimary: '#9ca3af', // Серебристый серый
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        colorInfo: '#3b82f6',

        colorBgBase: '#111827', // Темный графит
        colorBgContainer: '#1f2937', // Глубокий графит
        colorBgElevated: '#374151', // Средний графит
        colorBgLayout: '#111827',

        colorTextBase: '#f9fafb', // Блестящий белый
        colorTextSecondary: '#d1d5db', // Светло-серебристый
        colorTextTertiary: '#9ca3af', // Серебристый
        colorTextQuaternary: '#6b7280', // Темно-серебристый

        colorBorder: '#374151', // Темный металл
        colorBorderSecondary: '#4b5563', // Средний металл

        borderRadius: 8,
        fontSize: 14,
        lineHeight: 1.5715,

        colorPrimaryBg: '#1f2937',
        colorPrimaryBorder: '#4b5563',
    },
    components: {
        Layout: {
            headerBg: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
            bodyBg: 'linear-gradient(145deg, #111827 0%, #1f2937 100%)',
            siderBg: '#1f2937',
            triggerBg: '#374151',
            triggerColor: '#f9fafb',
        },
        Input: {
            colorBgContainer: '#1f2937',
            hoverBorderColor: '#9ca3af',
            activeBorderColor: '#d1d5db',
            colorText: '#f9fafb',
            colorTextPlaceholder: '#6b7280',
            paddingBlock: 8,
            paddingBlockLG: 10,
            paddingBlockSM: 4,
            activeShadow: '0 0 0 2px rgba(156, 163, 175, 0.3)',
        },
        Button: {
            ...BUTTON_PADDING,
            colorPrimary: '#374151',
            colorPrimaryHover: '#4b5563',
            colorPrimaryActive: '#6b7280',
            colorText: '#f9fafb',
            defaultBg: 'linear-gradient(145deg, #1f2937 0%, #374151 100%)',
            defaultBorderColor: '#4b5563',
        },
        Card: {
            ...CARD,
            colorBgContainer: '#1f2937',
            colorBorder: '#374151',
            boxShadow:
                '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.12)',
        },
        Menu: {
            colorBgContainer: '#1f2937',
            itemBg: '#1f2937',
            itemSelectedBg: 'linear-gradient(90deg, #374151 0%, #4b5563 100%)',
            itemColor: '#d1d5db',
            itemSelectedColor: '#f9fafb',
            itemHoverBg: '#374151',
            itemActiveBg: 'linear-gradient(90deg, #4b5563 0%, #6b7280 100%)',
        },
        Table: {
            colorBgContainer: '#1f2937',
            colorBorderSecondary: '#374151',
            colorFillAlter: '#111827',
            headerBg: '#374151',
            headerSplitColor: '#4b5563',
            rowHoverBg: '#374151',
        },
        Typography: {
            colorTextHeading: '#f9fafb',
            colorText: '#d1d5db',
            colorTextSecondary: '#9ca3af',
            colorTextDescription: '#6b7280',
        },
        Divider: {
            colorSplit: '#374151',
        },
        Tabs: {
            colorBgContainer: '#1f2937',
            colorBorderSecondary: '#374151',
            itemSelectedColor: '#f9fafb',
            inkBarColor: '#9ca3af',
        },
    },
};

export const themes: Record<ThemeMode, CustomThemeConfig> = {
    light: lightTheme,
    dark: darkTheme,
};
