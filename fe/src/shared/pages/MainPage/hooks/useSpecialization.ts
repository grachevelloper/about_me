import { useTranslation } from 'react-i18next';

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
                    icon: '/assets/skills/ts.svg',
                    title: t('skill.env.ts'),
                },
                {
                    icon: '/assets/skills/react.svg',
                    title: t('skill.env.react'),
                },
                {
                    icon: '/assets/skills/nest.svg',
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
                    icon: '/assets/skills/docker.svg',
                    title: t('skill.infrastracture.docker'),
                },
                {
                    icon: '/assets/skills/postgresql.svg',
                    title: t('skill.infrastracture.postgresql'),
                },
                {
                    icon: '/assets/skills/nginx.svg',
                    title: t('skill.infrastracture.nginx'),
                },
            ],
        },
    ];
    return {specialization};
};
