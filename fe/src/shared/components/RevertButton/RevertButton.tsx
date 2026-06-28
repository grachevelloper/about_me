import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {ButtonAccept} from '../actions';

import './RevertButton.scss';

const b = block('revert-button');

export const RevertButton = () => {
    const {t} = useTranslation('common');
    const navigate = useNavigate();

    const handleClick = () => {
        void navigate(-1);
    };
    return (
        <ButtonAccept
            className={b()}
            text={t('page.revert.button')}
            onClick={handleClick}
        />
    );
};
