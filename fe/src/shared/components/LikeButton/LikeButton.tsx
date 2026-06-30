import {HeartFilled, HeartOutlined} from '@ant-design/icons';
import {Button, Space, theme, Tooltip, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

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
    const {t} = useTranslation('common');
    const {
        token: {colorPrimary},
    } = theme.useToken();
    const HeartIcon = isLiked ? HeartFilled : HeartOutlined;

    return (
        <Tooltip title={t(isLiked ? 'unlike' : 'like')}>
            <Button
                type='text'
                size='small'
                disabled={disabled}
                onClick={onClick}
                className={b({liked: isLiked})}
                aria-pressed={isLiked}
                aria-label={t(isLiked ? 'unlike' : 'like')}
            >
                <Space size={4} align='center'>
                    <HeartIcon
                        style={{color: isLiked ? colorPrimary : undefined}}
                    />
                    <Typography.Text className={b('count')}>
                        {likesCount ?? 0}
                    </Typography.Text>
                </Space>
            </Button>
        </Tooltip>
    );
};
