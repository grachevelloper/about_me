import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

export const useTimeline = () => {
    const {t} = useTranslation('common');

    const timelineItems = useMemo(() => {
        return [
            {
                title: t('about.timeline.uni.date'),
                content: t('about.timeline.uni.content'),
                rail: '12',
                index: 0,
            },
            {
                title: t('about.timeline.ya.date'),
                content: t('about.timeline.ya.content'),
                rail: '18',
                index: 1,
            },
            {
                title: t('about.timeline.avi.date'),
                content: t('about.timeline.avi.content'),
                rail: '8',
                index: 2,
            },
        ];
    }, [t]);
    return {timelineItems};
};
