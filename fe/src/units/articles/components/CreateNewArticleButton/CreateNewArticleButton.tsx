import {notification, theme} from 'antd';
import block from 'bem-cn-lite';
import {Fragment, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {ButtonAccept} from '@/shared/components/actions';

import {useCreateArticle} from '../../store';
import {Article} from '../../types';
import {EMPTY_ARTICLE_BASE} from '../../utils/constants';
import './CreateNewArticleButton.scss';

const b = block('create-new-article-button');

export const CreateNewArticleButton = () => {
    const [api, contextHolder] = notification.useNotification();
    const {t} = useTranslation('article');
    const {
        token: {},
    } = theme.useToken();
    const {data: newArticle, isPending, mutateAsync} = useCreateArticle();

    const navigate = useNavigate();

    const emptyArticle: Omit<Article, 'author' | 'image'> = {
        ...EMPTY_ARTICLE_BASE,
        title: t('article.new.title'),
    };

    const handleNewArticle = useCallback(async () => {
        const data = await mutateAsync(emptyArticle);
        if (data) {
            navigate(`/articles/draft/${data.id}`);
        } else {
            api['error']({
                message: t('article.new.title.error'),
                description: t('article.new.description.error'),
                placement: 'bottomRight',
            });
        }
    }, [navigate, emptyArticle]);

    return (
        <Fragment>
            {contextHolder}
            <ButtonAccept
                className={b()}
                text={t('articles.create')}
                onClick={handleNewArticle}
            />
        </Fragment>
    );
};
