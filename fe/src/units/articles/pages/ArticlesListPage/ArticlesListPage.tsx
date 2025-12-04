import {Button, Col, Flex, Input, Row, Space, Typography} from 'antd';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {Article} from '../../types';

import {ArticleCard} from './components/ArticleCard';
import {SearchPanel} from './components/SearchPanel';

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
        <Flex
            vertical
            gap='large'
            style={{padding: '24px', maxWidth: 1200, margin: '0 auto'}}
        >
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

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 32,
                }}
            >
                <Space>
                    <Button type='primary'>1</Button>
                    <Button>2</Button>
                    <Button>3</Button>
                    <Button>4</Button>
                    <Button>...</Button>
                    <Button>{t('pagination.next')}</Button>
                </Space>
            </div>
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
