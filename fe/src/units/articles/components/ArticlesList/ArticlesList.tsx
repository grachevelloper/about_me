import {UseQueryResult} from '@tanstack/react-query';
import {Col, Flex, Row, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {EmptyContainer} from '@/shared/components/EmptyContainer';

import {Article} from '../../types';
import {EMPTY_ARTICLE_BASE} from '../../utils/constants';
import {ArticleCard, ArticleCardSkeleton} from '../ArticleCard';
import './ArticlesList.scss';

const b = block('articles-list');

type ArticleListProps = Pick<
    UseQueryResult<Article[], Error>,
    'data' | 'isPending' | 'error'
>;
export const ArticlesList = ({
    data: articles,
    isPending,
    error,
}: ArticleListProps) => {
    const {
        token: {paddingLG, padding},
    } = theme.useToken();
    const {t} = useTranslation('article');
    const navigate = useNavigate();
    const handleArticleClick = (id: string, isDraft: boolean) => {
        if (isDraft) {
            navigate(`/articles/draft/${id}`);
        } else {
            navigate(`/articles/${id}`);
        }
    };

    if (error) {
        return <Row></Row>;
    }

    if (isPending) {
        const skeletons = Array(9).fill(EMPTY_ARTICLE_BASE);
        return (
            <Row
                className={b()}
                gutter={[paddingLG, padding]}
                justify='space-around'
            >
                {skeletons.map((_: Article, index: number) => (
                    <Col
                        key={index}
                        xl={6}
                        md={12}
                        xs={24}
                        className={b('col')}
                    >
                        <ArticleCardSkeleton />
                    </Col>
                ))}
            </Row>
        );
    }
    return articles?.length ? (
        <Row
            className={b()}
            gutter={[paddingLG, padding]}
            justify='space-around'
        >
            {articles.map((article: Article) => (
                <Col
                    key={article.id}
                    xl={6}
                    md={12}
                    xs={24}
                    className={b('col')}
                >
                    <ArticleCard
                        article={article}
                        onClick={() =>
                            handleArticleClick(article.id, article.isDraft)
                        }
                    />
                </Col>
            ))}
        </Row>
    ) : (
        <EmptyContainer
            className={b('empty')}
            description={
                <Flex vertical gap={4} justify='center' align='center'>
                    <Typography.Title level={2}>
                        {t('aritcle.void_container.description')}
                    </Typography.Title>
                </Flex>
            }
        />
    );
};
