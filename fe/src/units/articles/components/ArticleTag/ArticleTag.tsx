import {Tag as AntTag, theme} from 'antd';
import block from 'bem-cn-lite';

import {Tag} from '../../types';

import './ArticleTag.scss';

const b = block('article-tag');

interface TagProps {
    tag: Tag;
    editable?: boolean;
    onClose?: (id: string) => void;
}
export const ArticleTag = ({tag, editable, onClose}: TagProps) => {
    const {
        token: {colorPrimary, colorBorder, borderRadius},
    } = theme.useToken();
    return (
        <AntTag
            color={colorPrimary}
            style={{
                borderRadius,
                border: `1px solid ${colorBorder}`,
            }}
            className={b()}
            closable={editable}
            onClose={() => onClose?.(tag.id)}
        >
            {tag.name}
        </AntTag>
    );
};
