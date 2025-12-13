import {Tag as AntTag, theme} from 'antd';
import block from 'bem-cn-lite';

import './ArticleTag.scss';

const b = block('article-tag');

interface TagProps {
    name: string;
}
export const ArticleTag = ({name}: TagProps) => {
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
        >
            {name}
        </AntTag>
    );
};
