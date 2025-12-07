import {Flex, Form} from 'antd';
import block from 'bem-cn-lite';
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
    const {t} = useTranslation('auth');
    const [form] = Form.useForm<SignInForm>();
    const navigate = useNavigate();
    const {isPending, isError, mutateAsync, user} = useSigninMutatuon();
    const {setUserData} = useAuth();
    const handleSubmit = async () => {
        const userData = await form.validateFields(['email', 'password']);
        console.log(userData);
        await mutateAsync(userData);
        if (user) {
            setUserData(user);
            navigate('/todos');
        }
    };
    const signInFields = useSignInFields(form);

    const renderSignInFields = () => {
        return signInFields.map((field) => (
            <FormInput field={field} key={field.name} />
        ));
    };

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
                </FlexibleCard>
            </Form>
        </Flex>
    );
};
