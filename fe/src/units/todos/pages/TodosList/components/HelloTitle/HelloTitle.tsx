import {Typography} from 'antd';

import {getTimeOfDay} from './utilts';

export const HelloTitle = () => {
    return (
        <Typography.Title level={1}>{getTimeOfDay('Коля')}</Typography.Title>
    );
};
