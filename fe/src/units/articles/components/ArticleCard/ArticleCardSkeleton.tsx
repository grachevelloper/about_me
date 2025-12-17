import {Skeleton} from 'antd';
import block from 'bem-cn-lite';

import './ArticleCard.scss';

const b = block('article-card');

export const ArticleCardSkeleton = () => {
    return (
        <div className={b()}>
            <Skeleton.Image
                active
                style={{
                    width: 'clamp(285px, 272.86px + 3.79vw, 370px)',
                    height: 400,
                }}
            />
            <Skeleton
                active
                paragraph={{rows: 2}}
                style={{
                    marginTop: 10,
                }}
            />
        </div>
    );
};
