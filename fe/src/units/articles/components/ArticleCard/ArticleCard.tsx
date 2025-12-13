import {CalendarOutlined} from '@ant-design/icons';
import {Card, Flex, Image, Tag, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {Article} from '@/articles/types';

import './ArticleCard.scss';
import {formatDate} from '../../../../shared/utils/date';

const b = block('article-card');

const {Text, Title} = Typography;

interface ArticleCardProps {
    article: Article;
    onClick: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({article, onClick}) => {
    const {t} = useTranslation('article');
    const {
        token: {padding, paddingSM, borderRadius},
    } = theme.useToken();
    return (
        <Card
            hoverable
            className={b()}
            onClick={onClick}
            size='default'
            style={{
                borderRadius,
            }}
            cover={
                <Image
                    alt={article.title}
                    src={
                        'https://cdn.mos.cms.futurecdn.net/Tn2awspunwJuaJY7MUE4PM-2560-80.jpg'
                    }
                    preview={false}
                    style={{
                        borderRadius,
                    }}
                    className={b('image')}
                />
            }
        >
            <Flex
                className={b('info-wrapper')}
                justify='end'
                align='start'
                vertical
                gap={8}
                style={{
                    padding: paddingSM,
                    borderRadius,
                }}
            >
                <Title level={3} className={b('title')}>
                    {article.title}
                </Title>
                <Flex justify='start' align='center' gap={4} wrap>
                    {article.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag.id} bordered={false} className={b('tag')}>
                            {tag.name}
                        </Tag>
                    ))}
                </Flex>

                <Flex
                    justify='space-between'
                    align='center'
                    gap={8}
                    className={b('footer')}
                >
                    <Flex gap={4}>
                        <CalendarOutlined />
                        <Typography.Text type='secondary'>
                            {formatDate(article?.createdAt)}
                        </Typography.Text>
                    </Flex>

                    <Text type='secondary' className={b('read-time')}>
                        {t('article.read_time', {
                            minutes: article.readTime,
                        })}
                    </Text>
                </Flex>
            </Flex>
        </Card>
    );
};
