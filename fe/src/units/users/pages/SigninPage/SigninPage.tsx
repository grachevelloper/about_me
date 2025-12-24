import {Flex, Form, theme} from 'antd';
import block from 'bem-cn-lite';
import {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {ButtonAccept} from '@/shared/components/actions';
import {FlexibleCard} from '@/shared/components/FlexibleCard';
import {FormInput} from '@/shared/components/FormInput';
import {useAuth} from '@/shared/context';

import {AuthNavigateButton} from '../../components/AuthNavigateButton';
import {useSigninMutatuon} from '../../store';

import {useSignInFields} from './hooks';

import './SigninPage.scss';

const b = block('sign-in-page');

interface SignInForm {
    email: string;
    password: string;
}

export const SigninPage = () => {
    const {
        token: {colorError, paddingSM},
    } = theme.useToken();
    const {t} = useTranslation('auth');
    const [form] = Form.useForm<SignInForm>();
    const navigate = useNavigate();
    const {isPending, error, mutateAsync, user} = useSigninMutatuon();
    const {setUserData} = useAuth();
    const handleSubmit = async () => {
        const userData = await form.validateFields(['email', 'password']);
        await mutateAsync(userData);
        if (user) {
            setUserData(user);
            navigate('/');
        }
    };
    const signInFields = useSignInFields(form);

    const renderSignInFields = useCallback(() => {
        return signInFields.map((field) => (
            <FormInput
                field={{...field, style: {marginBottom: paddingSM}}}
                key={field.name}
            />
        ));
    }, [signInFields]);

    const renderErrors = useCallback(() => {
        const errorText = () => {
            switch (error?.message) {
                case 'Invalid credentials':
                    return t('auth.sign.invalid_credentials');
                case 'Incorrect password':
                    return t('auth.sign.incorrect_password');
                default:
                    return '';
            }
        };

        return (
            <span
                style={{
                    paddingLeft: paddingSM,
                    color: colorError,
                }}
                className={b('server-error')}
            >
                {errorText()}
            </span>
        );
    }, [error]);

    useEffect(() => {
        form.setFieldsValue({
            email: '',
            password: '',
        });
    }, [form]);

    useEffect(() => {
        console.log('rjsbrogujik;drmgm', error);
    }, [error]);

    return (
        <Flex className={b()} align='center' justify='center'>
            <Form form={form} onFinish={handleSubmit}>
                <FlexibleCard
                    className={b('container')}
                    actionsAlign='end'
                    actions={[
                        <ButtonAccept
                            text={t('auth.signin.submit')}
                            key={'accept-signin'}
                            onClick={handleSubmit}
                        />,
                    ]}
                >
                    {renderSignInFields()}
                    {renderErrors()}
                </FlexibleCard>
            </Form>
        </Flex>
    );
};
