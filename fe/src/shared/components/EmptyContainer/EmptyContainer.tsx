import {Empty, EmptyProps, theme} from 'antd';
import block from 'bem-cn-lite';

import './EmptyContainer.scss';

const b = block('empty-container');

export const EmptyContainer = ({...props}: EmptyProps) => {
    const {
        token: {},
    } = theme.useToken();
    return <Empty className={b()} {...props} />;
};
