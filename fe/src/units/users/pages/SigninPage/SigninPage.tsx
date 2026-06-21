import {Flex, Form, theme, Typography} from 'antd';
import block from 'bem-cn-lite';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {ButtonAccept} from '@/shared/components/actions';
import {FlexibleCard} from '@/shared/components/FlexibleCard';
import {FormInput} from '@/shared/components/FormInput';
import {useAuth} from '@/shared/context';

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
    const {isPending, error, mutateAsync} = useSigninMutatuon();
    const {setUserData} = useAuth();
    const handleSubmit = useCallback(async () => {
        try {
            const userData = await form.validateFields(['email', 'password']);
            const user = await mutateAsync(userData);
            form.resetFields();
            setUserData(user);
            navigate('/');
        } catch {
            form.setFieldValue('password', '');
        }
    }, [form, mutateAsync, navigate, setUserData]);
    const signInFields = useSignInFields(form);

    const renderSignInFields = useCallback(() => {
        return signInFields.map((field) => (
            <FormInput
                field={{...field, style: {marginBottom: paddingSM}}}
                key={field.name}
            />
        ));
    }, [paddingSM, signInFields]);

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
    }, [colorError, error, paddingSM, t]);

    return (
        <Flex className={b()} align='center' justify='center'>
            <Form
                className={b('form')}
                form={form}
                layout='vertical'
                autoComplete='off'
                onFinish={() => {
                    void handleSubmit();
                }}
                initialValues={{email: '', password: ''}}
            >
                <FlexibleCard
                    className={b('container')}
                    title={
                        <Typography.Title level={2} className={b('title')}>
                            {t('auth.signin.title')}
                        </Typography.Title>
                    }
                    actionsAlign='end'
                    actions={[
                        <ButtonAccept
                            text={t('auth.signin.submit')}
                            key={'accept-signin'}
                            htmlType='submit'
                            loading={isPending}
                            disabled={isPending}
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
