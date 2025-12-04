import {Button, Html} from '@react-email/components';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';
import './GreetingsEnvelope.scss';

const b = block('greetings-envelope');

export const GreetingsEnvelope = () => {
    const {i18n} = useTranslation();
    return (
        <Html lang={i18n.language}>
            <Button
                href='https://example.com'
                style={{
                    background: '#000',
                    color: '#fff',
                    padding: '12px 20px',
                }}
            >
                Click me
            </Button>
        </Html>
    );
};
