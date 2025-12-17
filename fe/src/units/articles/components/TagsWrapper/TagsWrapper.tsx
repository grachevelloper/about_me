import {Flex, Skeleton, theme} from 'antd';
import block from 'bem-cn-lite';

import {useDeleteTag} from '../../store/tags';
import {Tag} from '../../types';
import {ArticleTag} from '../ArticleTag';
import './TagsWrapper.scss';

const b = block('tags-wrapper');

interface TagsWrapperProps {
    tags?: Tag[];
    isPending: boolean;
    onChange?: (tags: Tag[]) => void;
}

export const TagsWrapper = ({tags, isPending, onChange}: TagsWrapperProps) => {
    const {
        token: {},
    } = theme.useToken();
    const {
        mutate: deleteTag,
        error: errorDelete,
        isPending: isDeletePending,
    } = useDeleteTag();

    if (isPending) {
        return <Skeleton.Node />;
    }
    return (
        <Flex align='center' justify='start' gap={2} className={b()}>
            {(tags || []).map((tag: Tag) => (
                <ArticleTag
                    tag={tag}
                    key={tag.id}
                    editable={Boolean(onChange)}
                    onClose={deleteTag}
                />
            ))}
        </Flex>
    );
};
