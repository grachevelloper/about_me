import {Col, Image, Input, Row, Select, Typography, theme} from 'antd';
import block from 'bem-cn-lite';

import {useAuth} from '@/shared/context';

import './UserPage.scss';

const {Title, Text, Paragraph} = Typography;
const {TextArea} = Input;
const {Option} = Select;

const b = block('user-page');

export const UserPage = () => {
    const {token} = theme.useToken();
    const {user} = useAuth();

    return (
        <div className={b()}>
            <Row gutter={[24, 24]}>
                <Col span={16}></Col>
                <Col span={8}>

                </Col>
            </Row>
        </div>
    );
};
