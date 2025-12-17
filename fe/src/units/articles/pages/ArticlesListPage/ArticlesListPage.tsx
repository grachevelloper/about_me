import {Col, Flex, Input, Row, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {useAuth} from '@/shared/context';
import {Role} from '@/typings/common';

import {ArticlesList} from '../../components/ArticlesList';
import {CreateNewArticleButton} from '../../components/CreateNewArticleButton';
import {SearchPanel} from '../../components/SearchPanel';
import {useGetAllArticles} from '../../store';

import './ArticlesListPage.scss';

const b = block('aritcles-list-page');

const {Title, Text, Paragraph} = Typography;
const {Search} = Input;

export const ArticlesListPage = () => {
    const {t} = useTranslation('article');
    const {
        token: {colorPrimary},
    } = theme.useToken();
    const {user} = useAuth();
    const role = user?.role || Role.USER;
    const {data: articles, isPending, error} = useGetAllArticles();

    const canWriteArticle = role === Role.WRITER || role === Role.ADMIN;

    const handleSearch = (value: string) => {
        console.log('Search:', value);
    };

    const handleCategorySelect = (category: string) => {
        console.log('Selected category:', category);
    };

    const renderNewArticleButton = () => {
        return canWriteArticle && <CreateNewArticleButton />;
    };

    return (
        <Flex vertical gap='large' className={b()}>
            <Row>
                <Col xs={24} md={16}>
                    <Title level={1} style={{marginBottom: '8px'}}>
                        {t('articles.page.title')}
                    </Title>
                    <Text type='secondary'>{t('articles.page.subtitle')}</Text>
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

            <ArticlesList
                articles={articles}
                isPending={isPending}
                error={error}
            />
        </Flex>
    );
};
