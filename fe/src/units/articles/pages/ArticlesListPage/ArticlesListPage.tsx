import {Col, Flex, Input, Row, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {ButtonAccept} from '@/shared/components/actions';
import {useAuth} from '@/shared/context';
import {Role} from '@/typings/common';

import {ArticleCard} from '../../components/ArticleCard';
import {SearchPanel} from '../../components/SearchPanel';
import {Article} from '../../types';

import './ArticlesListPage.scss';

const b = block('aritcles-list-page');

const {Title, Text, Paragraph} = Typography;
const {Search} = Input;

export const ArticlesListPage = () => {
    const {user} = useAuth();

    const {
        token: {colorPrimary},
    } = theme.useToken();
    const role = user?.role || Role.USER;

    const {t} = useTranslation('article');
    const navigate = useNavigate();

    const canWriteArticle = role === Role.WRITER || role === Role.ADMIN;

    const mockArticles: Article[] = [
        {
            id: '1',
            title: 'Древний рим в новое время',
            createdAt: new Date(Date.now()),
            likesCount: 89,
            content: 'ПОПОАОАО',
            comments: [],
            tags: [{id: '1', name: 'react'}],
            readTime: 3,
            hasLiked: true,
            image: 'https://picsum.photos/400/250?random=1',
        },
    ];

    const handleArticleClick = (id: string) => {
        navigate(`/articles/${id}`);
    };

    const handleSearch = (value: string) => {
        console.log('Search:', value);
    };

    const handleCategorySelect = (category: string) => {
        console.log('Selected category:', category);
    };

    const renderNewArticleButton = () => {
        return canWriteArticle && <ButtonAccept text={t('articles.create')} />;
    };

    return (
        <Flex vertical gap='large' className={b()}>
            <Row>
                <Col xs={24} md={16}>
                    <Title level={1} style={{marginBottom: '8px'}}>
                        {t('page.title')}
                    </Title>
                    <Text type='secondary'>{t('page.subtitle')}</Text>
                </Col>
                <Col xs={16} sm={8} className={b('create-article-button-row')}>
                    {renderNewArticleButton()}
                </Col>
            </Row>

            <Row gutter={[16, 16]} align='middle'>
                <Col xs={24} md={24}>
                    <SearchPanel />
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {mockArticles.map((article) => (
                    <Col key={article.id} xs={24} sm={12} lg={8}>
                        <ArticleCard
                            article={article}
                            onClick={() => handleArticleClick(article.id)}
                        />
                    </Col>
                ))}
            </Row>
        </Flex>
    );
};
