import {FloatButton, theme} from 'antd';
import block from 'bem-cn-lite';
import {FaEyeSlash, FaRegEye} from 'react-icons/fa';

import {useSidebar} from '@/shared/context/Sidebar';
import {useLayout} from '@/shared/hooks';
import './ViewModeToggle.scss';

const b = block('view-mode-toggle');

export const ViewModeToggle = () => {
    const {
        token: {},
    } = theme.useToken();
    const {isCollapsed, toggleCollapsed} = useSidebar();

    const {isDesktop} = useLayout();

    return (
        isDesktop && (
            <FloatButton
                className={b()}
                shape='circle'
                type='primary'
                onClick={toggleCollapsed}
                icon={
                    isCollapsed ? (
                        <FaEyeSlash size={24} />
                    ) : (
                        <FaRegEye size={24} />
                    )
                }
                tooltip={
                    isCollapsed ? 'Выйти из режима чтения' : 'Режим чтения'
                }
            />
        )
    );
};
