import {useTranslation} from 'react-i18next';

export type Specialization = {
    segment: Skill[];
    segmentTitle: string;
};

type Skill = {
    title: string;
    icon: string;
};

export const useSpecialization = () => {
    const {t} = useTranslation('common');
    const specialization: Specialization[] = [
        {
            segmentTitle: t('skill.env'),
            segment: [
                {
                    icon: '/assets/env/ts.svg',
                    title: t('skill.env.ts'),
                },
                {
                    icon: '/assets/env/react.svg',
                    title: t('skill.env.react'),
                },
                {
                    icon: '/assets/env/nest.svg',
                    title: t('skill.env.express'),
                },
            ],
        },
        {
            segmentTitle: t('skill.state_managers'),
            segment: [
                {
                    icon: '/assets/skills/redux.svg',
                    title: t('skill.state_managers.redux'),
                },
                {
                    icon: '/assets/skills/react-query.svg',
                    title: t('skill.state_managers.react-query'),
                },
                {
                    icon: '/assets/skills/mobx.svg',
                    title: t('skill.state_managers.mobx'),
                },
            ],
        },
        {
            segmentTitle: t('skill.infrastracture'),
            segment: [
                {
                    icon: '/assets/skills/docker',
                    title: t('skill.infrastracture.docker'),
                },
                {
                    icon: '/assets/skills/postgresql',
                    title: t('skill.infrastracture.postgresql'),
                },
                {
                    icon: '/assets/skills/nginx',
                    title: t('skill.infrastracture.nginx'),
                },
            ],
        },
    ];
    return {specialization};
};
