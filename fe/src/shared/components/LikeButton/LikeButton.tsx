import {Statistic, theme} from 'antd';
import block from 'bem-cn-lite';
import {IoIosHeart} from 'react-icons/io';

import './LikeButton.scss';

const b = block('like-button');

interface LikeButtonProps {
    isLiked: boolean;
    onClick: () => void;
    likesCount?: number;
}

export const LikeButton = ({isLiked, onClick, likesCount}: LikeButtonProps) => {
    const {
        token: {colorPrimary, fontSize},
    } = theme.useToken();
    return (
        <Statistic
            prefix={
                <IoIosHeart
                    onClick={onClick}
                    size={18}
                    color={isLiked ? colorPrimary : undefined}
                />
            }
            value={likesCount}
            className={b()}
            aria-label='button'
        />
    );
};
