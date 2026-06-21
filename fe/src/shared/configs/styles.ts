import {ThemeConfig} from 'antd';
import {LayoutToken} from 'antd/es/layout/style';
import {StepsToken} from 'antd/es/steps/style';
import {TimelineToken} from 'antd/es/timeline/style';

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

const TIMELINE: Partial<TimelineToken> = {
    dotSize: 22,
    tailWidth: 6,
    colorIcon: '#4f46e5',
};

const STEPS: Partial<StepsToken> = {
    dotCurrentSize: 22,
    dotSize: 22,
};

const LAYOUT: Partial<LayoutToken> = {
    footerPadding: 8,
};

const lightTheme: CustomThemeConfig = {
    name: 'light',
    token: {
        colorPrimary: '#4f46e5',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',

        colorInfo: '#3b82f6',

        colorBgBase: '#ffffff',
        colorBgContainer: '#f9fafb',
        colorBgElevated: '#ffffff',
        colorBgLayout: '#f8fafc',

        colorBgMask: 'rgba(0, 0, 0, 0.1)',
        colorBgBlur: 'rgba(255, 255, 255, 0.85)',
        colorBgSpotlight: 'rgba(222, 223, 223, 0.95)',

        colorTextBase: '#1f2937',
        colorTextSecondary: '#4b5563',

        colorTextTertiary: '#6b7280',
        colorTextQuaternary: '#9ca3af',

        colorBorder: '#d1d5db',
        colorBorderSecondary: '#e5e7eb',

        borderRadius: 8,
        fontSize: 14,
        lineHeight: 1.5715,

        colorPrimaryBg: '#eef2ff',
        colorPrimaryBorder: '#c7d2fe',
    },
    components: {
        Layout: {
            ...LAYOUT,
            headerBg: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            bodyBg: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            siderBg: '#f9fafb',
            triggerBg: '#e5e7eb',
            triggerColor: '#1f2937',
            footerBg: '#d5d5d5ff',
        },
        Input: {
            colorBgContainer: '#ffffff',
            hoverBorderColor: '#4f46e5',
            activeBorderColor: '#4338ca',
            colorText: '#1f2937',
            colorTextPlaceholder: '#9ca3af',
            activeShadow: '0 0 0 2px rgba(79, 70, 229, 0.2)',
        },
        Button: {
            ...BUTTON_PADDING,
            colorPrimary: '#4f46e5',
            colorPrimaryHover: '#4338ca',
            colorPrimaryActive: '#3730a3',
            colorText: '#374151',
            defaultShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
            primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.1)',
            defaultBg: '#ffffff',
            defaultBorderColor: '#d1d5db',
            defaultColor: '#374151',
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
            itemSelectedBg: 'linear-gradient(90deg, #eef2ff 0%, #e0e7ff 100%)',
            itemColor: '#1f2937',
            itemHoverColor: '#7069f0ff',
            itemSelectedColor: '#4f46e5',
            itemActiveBg: 'linear-gradient(90deg, #e0e7ff 0%, #c7d2fe 100%)',
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
            itemSelectedColor: '#4f46e5',
            inkBarColor: '#4f46e5',
        },
        Timeline: {
            ...TIMELINE,
            dotBg: '#ffffff',
            tailColor: '#4f46e5',
        },
    },
};

const darkTheme: CustomThemeConfig = {
    name: 'dark',
    token: {
        colorPrimary: '#818cf8',
        colorSuccess: '#34d399',
        colorWarning: '#fbbf24',
        colorError: '#f87171',
        colorInfo: '#60a5fa',

        colorBgBase: '#111827',
        colorBgContainer: '#1f2937',
        colorBgElevated: '#374151',
        colorBgLayout: '#111827',

        colorTextBase: '#f9fafb',
        colorTextSecondary: '#d1d5db',
        colorTextTertiary: '#9ca3af',
        colorTextQuaternary: '#6b7280',
        colorBorder: '#374151',
        colorBorderSecondary: '#4b5563',

        borderRadius: 8,
        fontSize: 14,
        lineHeight: 1.5715,

        colorPrimaryBg: '#1e1b4b',
        colorPrimaryBorder: '#4338ca',
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
            hoverBorderColor: '#818cf8',
            activeBorderColor: '#a5b4fc',
            colorText: '#f9fafb',
            colorTextPlaceholder: '#6b7280',
            paddingBlock: 8,
            paddingBlockLG: 10,
            paddingBlockSM: 4,
            activeShadow: '0 0 0 2px rgba(129, 140, 248, 0.3)',
        },
        Button: {
            ...BUTTON_PADDING,
            colorPrimary: '#818cf8',
            colorPrimaryHover: '#6366f1',
            colorPrimaryActive: '#4f46e5',
            colorText: '#d1d5db',
            defaultBg: '#1f2937',
            defaultBorderColor: '#4b5563',
            defaultColor: '#d1d5db',
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
            itemSelectedBg: 'linear-gradient(90deg, #3730a3 0%, #312e81 100%)',
            itemColor: '#d1d5db',
            itemSelectedColor: '#818cf8',
            itemHoverBg: '#374151',
            itemActiveBg: 'linear-gradient(90deg, #312e81 0%, #1e1b4b 100%)',
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
            itemSelectedColor: '#818cf8',
            inkBarColor: '#818cf8',
        },
        Timeline: {
            ...TIMELINE,
            dotBg: '#111827',
            tailColor: '#818cf8',
        },
        Steps: {
            ...STEPS,
        },
    },
};

export const themes: Record<ThemeMode, CustomThemeConfig> = {
    light: lightTheme,
    dark: darkTheme,
};
