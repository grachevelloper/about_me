import {Col, Divider, Image, Row, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {CommentsWrapper} from '@/shared/components/CommentsWrapper';
import {LikeButton} from '@/shared/components/LikeButton';
import {useLayout} from '@/shared/hooks';
import {formatDate} from '@/shared/utils';

import {ArticleTag} from '../../components/ArticleTag';
import {type Article, type Tag} from '../../types';

import './ArticlePage.scss';

const b = block('article-page');

const {Title, Text} = Typography;

export const ArticlePage = () => {
    const {isDesktop} = useLayout();
    const {t} = useTranslation('article');
    const {t: tCommon} = useTranslation('common');
    const {
        token: {
            padding,
            fontSize,
            colorBorder,
            colorPrimary,
            colorTextSecondary,
            borderRadius,
        },
    } = theme.useToken();

    const initialData: Article = {
        id: '1',
        title: t('Древний рим в новое время'),
        createdAt: new Date('15 мая 2024'),
        likesCount: 89,
        content: `
Der modernste Verkehrsservice, mehr Programme und störungsfreier Empfang: Wer
den Radio-Standard DAB+ im Auto empfangen möchte, kann ihn nachrüsten. Wir
erklären, wie das geht und warum über zehn Jahre alte Autos im Vorteil
sind.
Einsteigen, losfahren und sich mit dem Daumen am Lenkrad durch die Sender
zappen – im Auto hat das Radio für viele seine eigentliche Daseinsberechtigung. Es
ist das perfekte Nebenbeimedium für unterwegs. Allerdings kommt die Technik in
die Jahre. Einen konkreten Abschalttermin gibt es für die in den Fünfzigern
eingeführte Ultrakurzwelle in Deutschland zwar nicht, doch das Digitalradio DAB+
wird ihr mittelfristig den Rang ablaufen. In Norwegen ist UKW bereits in den
Ruhestand verabschiedet worden, in der Schweiz steht die Pensionierung des
Dampfradios in zwei Jahren an. Auch in Deutschland wird der Ausbau der digitalen
Sendestationen vorangetrieben. Entlang der Autobahnen liegt die Abdeckung bereits
heute bei fast 100 Prozent, bundesweit bei rund 90 Prozent.
Im Auto beginnt die Umstellung wohl schon kommendes Jahr, jedenfalls formell.
Das EU-Parlament wird 2019 DAB+ als Pflichtausstattung bei Neuwagen
vorschreiben. Zwei Jahre sind als Übergangsfrist vorgesehen. Bis dahin müssen
Neuwagenkäufer je nach Hersteller noch einen Aufpreis für das Digitalradio zahlen.
Während RПовествование является основным типом, так как текст построен как последовательный рассказ о событиях в хронологическом порядке (от 1957 года к 1965-му и далее).

Описание используется для характеристики понятий (Вселенная, космос), объектов (первый спутник) и ситуаций (выход в открытый космос).

Рассуждение присутствует в объяснении важности тех или иных шагов («Тщательно изучив... ученые смогли...»).
ndersuchlauf ist passé, da alle verfügbaren
Stationen automatisch erkannt und mit Namen aufgelistet werden. Auch die
Favoritenliste bleibt bei bundesweiten Sendern aktuell, weil jeder Sender stets auf
seiner für ihn reservierten Welle ausgestrahlt wird. UKW kann das nicht. So oder
so: Wer häufig längere Strecken fährt, erspart sich mit DAB+ die nervige manuelle
Suche nach einem passenden Radioprogramm.`,
        comments: [],
        tags: [{id: '1', name: 'react'}],
        readTime: 3,
        image: '/assets/image-placeholder.png',
        hasLiked: true,
    };

    const renderTitle = () => {
        return (
            <Title
                level={1}
                style={{marginBottom: 0}}
                className={b('title')}
                ellipsis
            >
                {initialData.title}
            </Title>
        );
    };

    return (
        <div className={b()}>
            {!isDesktop ? (
                renderTitle()
            ) : (
                <Divider orientation='left' orientationMargin={0}>
                    {renderTitle()}
                </Divider>
            )}

            <Row
                gutter={32}
                justify='space-between'
                align='middle'
                style={{marginBottom: 24}}
            >
                <Col>
                    <Row gutter={16} align='middle'>
                        {initialData.readTime && (
                            <Col>
                                <Text type='secondary' style={{fontSize}}>
                                    {t('articles.read_time', {
                                        minutes: initialData.readTime,
                                    })}
                                </Text>
                            </Col>
                        )}
                    </Row>
                </Col>
                <Col>
                    <Row gutter={8} align='middle'>
                        {initialData.updatedAt && (
                            <Col>
                                <Text type='secondary' style={{fontSize}}>
                                    {tCommon('updated-at', {
                                        date: formatDate(
                                            initialData?.updatedAt
                                        ),
                                    })}
                                </Text>
                            </Col>
                        )}
                        {initialData.createdAt && (
                            <Col>
                                <Text type='secondary' style={{fontSize}}>
                                    {tCommon('created-at', {
                                        date: formatDate(initialData.createdAt),
                                    })}
                                </Text>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>

            {initialData.image && (
                <Row style={{marginBottom: 32}}>
                    <Col span={24}>
                        <Image
                            src={initialData.image}
                            alt={initialData.title}
                            style={{
                                width: '100%',
                                maxHeight: 400,
                                objectFit: 'cover',
                                borderRadius: borderRadius,
                                border: `1px solid ${colorBorder}`,
                            }}
                            preview={false}
                        />
                    </Col>
                </Row>
            )}

            {initialData.tags.length > 0 && (
                <Row gutter={8} style={{marginBottom: 32}}>
                    {initialData.tags.map((tag: Tag) => (
                        <Col key={tag.id}>
                            <ArticleTag name={tag.name} />
                        </Col>
                    ))}
                </Row>
            )}

            <Row>
                <Col span={24}>
                    <Typography.Text
                        className={b('content')}
                        style={{
                            fontSize,
                        }}
                    >
                        {initialData.content}
                    </Typography.Text>
                </Col>
            </Row>

            <Row justify='end'>
                <Col span='24'>
                    <LikeButton
                        isLiked={initialData.hasLiked}
                        onClick={() => {}}
                    />
                </Col>
            </Row>

            <Divider orientation='left' orientationMargin={0}>
                <Title level={3} style={{marginBottom: 0}}>
                    {tCommon('comments')} ({initialData.comments.length})
                </Title>
            </Divider>

            <Row>
                <Col span={24}>
                    <CommentsWrapper
                        entityId={initialData.id || ''}
                        entityType='article'
                    />
                </Col>
            </Row>
        </div>
    );
};
