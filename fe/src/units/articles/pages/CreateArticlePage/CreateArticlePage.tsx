import {Cascader, Col, Row, theme} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {MdEditor} from '@/shared/components/MdEditor';

import {ArticleTag} from '../../components/ArticleTag';
import {useCreateArticle} from '../../store';
import {Tag} from '../../types';

import './CreateArticlePage.scss';

const b = block('create-article-page');

export const CreateArticlePage = () => {
    const {t} = useTranslation('article');
    const {isPending, isError, data, mutate} = useCreateArticle();
    const {title, content, updatedAt, tags} = data || {
        title: '',
        content: '',
        tags: [],
    };
    const {
        token: {padding},
    } = theme.useToken();

    return (
        <div className={b()}>
            <Row>
                <Col>{title}</Col>
            </Row>
            <Row>
                <Col>
                    <Cascader multiple />
                    {tags?.map((tag: Tag) => (
                        <ArticleTag name={tag.name} key={tag.id} />
                    ))}
                </Col>
            </Row>
            <Row>
                <MdEditor
                    className={b('mk-editor')}
                    placeholder={t('article.placeholder')}
                    markdown={content}
                    editable
                />
            </Row>
        </div>
    );
};
