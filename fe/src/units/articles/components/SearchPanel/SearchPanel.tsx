import {Flex, Input} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import './SearchPanel.scss';

const b = block('search-panel');

export const SearchPanel = () => {
    const {t} = useTranslation('article');
    return (
        <Flex className={b()} justify='start' align='start' vertical gap={8}>
            <Input.Search
                variant='filled'
                placeholder={t('article.articles.search.placeholder')}
                size='large'
            />
            <Flex justify='start' align='center' gap={2}></Flex>
        </Flex>
    );
};
