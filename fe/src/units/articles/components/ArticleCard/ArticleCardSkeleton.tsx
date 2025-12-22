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
                    display: 'flex',
                    width: '100%',
                    height: 370,
                }}
                styles={{
                    root: {
                        width: '100%',
                    },
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
