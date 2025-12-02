import {Typography} from 'antd';
import block from 'bem-cn-lite';

import {getSticker, getTimeOfDay} from './utilts';

import './HelloTitle.scss';

const b = block('hello-title');

const hour = new Date().getHours();

export const HelloTitle = () => {
    return (
        <Typography.Title level={1} className={b()}>
            {getTimeOfDay('Коля', hour)}
            <div className={b('sticker')}>{getSticker(hour)}</div>
        </Typography.Title>
    );
};
