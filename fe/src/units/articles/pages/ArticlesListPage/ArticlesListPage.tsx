import {Col, Flex, Input, Row, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {Article} from '../../types';

import {ArticleCard} from './components/ArticleCard';
import {SearchPanel} from './components/SearchPanel';

import './ArticlesListPage.scss';

const b = block('aritcles-list-page');

const {Title, Text, Paragraph} = Typography;
const {Search} = Input;

export const ArticlesListPage = () => {
    const {t} = useTranslation('article');
    const navigate = useNavigate();

    const mockArticles: Article[] = [
        {
            id: '1',
            title: t('Древний рим в новое время'),
            createdAt: '15 мая 2024',
            likesCount: 89,
            content: 'ПОПОАОАО',
            comments: [],
            tags: [{id: '1', name: 'react'}],
            readTime: 3,
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

    return (
        <Flex vertical gap='large' className={b()}>
            <div>
                <Title level={1} style={{marginBottom: '8px'}}>
                    {t('page.title')}
                </Title>
                <Text type='secondary'>{t('page.subtitle')}</Text>
            </div>

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

interface StatisticItemProps {
    title: string;
    value: string;
    color: string;
}

const StatisticItem: React.FC<StatisticItemProps> = ({title, value, color}) => {
    return (
        <div style={{textAlign: 'center'}}>
            <div
                style={{
                    fontSize: 32,
                    fontWeight: 'bold',
                    color,
                    marginBottom: 4,
                }}
            >
                {value}
            </div>
            <Text type='secondary'>{title}</Text>
        </div>
    );
};
