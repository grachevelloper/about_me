import {Flex, Layout, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import {FaTelegramPlane} from 'react-icons/fa';
import {LuMail} from 'react-icons/lu';

import {EMAIL, TELEGRAMM} from '../../constants';
import './Footer.scss';

const b = block('footer');

const {Footer: AntFooter} = Layout;

export const Footer = () => {
    const {t} = useTranslation('common');
    const {
        token: {},
    } = theme.useToken();
    return (
        <AntFooter className={b()}>
            <Flex vertical gap={8}>
                <Typography.Title level={5}>
                    {t('footer.contacts')}
                </Typography.Title>
                <Flex gap={4} align='center'>
                    <FaTelegramPlane size={18} />
                    <Typography.Link>{TELEGRAMM}</Typography.Link>
                </Flex>
                <Flex gap={4} align='center'>
                    <LuMail size={18} />
                    <Typography.Link>{EMAIL}</Typography.Link>
                </Flex>
            </Flex>
        </AntFooter>
    );
};
