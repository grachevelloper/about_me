import {Statistic, theme} from 'antd';
import block from 'bem-cn-lite';
import {IoIosHeart} from 'react-icons/io';

import './LikeButton.scss';

const b = block('like-button');

interface LikeButtonProps {
    disabled?: boolean;
    isLiked: boolean;
    onClick: () => void;
    likesCount?: number;
}

export const LikeButton = ({
    disabled = false,
    isLiked,
    onClick,
    likesCount,
}: LikeButtonProps) => {
    const {
        token: {colorPrimary},
    } = theme.useToken();
    return (
        <Statistic
            prefix={
                <IoIosHeart
                    onClick={disabled ? undefined : onClick}
                    size={18}
                    color={isLiked ? colorPrimary : undefined}
                    style={{cursor: disabled ? 'not-allowed' : 'pointer'}}
                />
            }
            value={likesCount}
            className={b()}
            aria-label='button'
        />
    );
};
