import {theme} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {ButtonAccept} from '../actions';

import {useNavigate} from 'react-router-dom';
import './RevertButton.scss';

const b = block('revert-button');

export const RevertButton = () => {
    const {
        token: {},
    } = theme.useToken();
    const {t} = useTranslation('common');
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1);
    };
    return (
        <ButtonAccept
            className={b()}
            text={t('page.revert.button')}
            onClick={handleClick}
        />
    );
};
