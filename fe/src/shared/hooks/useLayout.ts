import {Grid} from 'antd';
import {useEffect, useState} from 'react';

const {useBreakpoint} = Grid;

export const useLayout = () => {
    const screens = useBreakpoint();
    const {md, xs, lg, sm} = screens;

    const [isSmall, setIsSmall] = useState<boolean>(Boolean(!lg));
    useEffect(() => {
        setIsSmall(Boolean(!lg));
    }, [lg]);

    return isSmall;
};
