import {
    BellOutlined,
    CameraOutlined,
    EditOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    HeartOutlined,
    LockOutlined,
    LogoutOutlined,
    MailOutlined,
    PhoneOutlined,
    SaveOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Space,
    Switch,
    Tooltip,
    Typography,
    Upload,
    message,
    theme,
} from 'antd';

import {useAuth} from '@/shared/context';

const {Title, Text, Paragraph} = Typography;
const {TextArea} = Input;
const {Option} = Select;

export const UserPage = () => {
    const {token} = theme.useToken();
    const {user} = useAuth();

    const styles = {
        container: {
            maxWidth: 1200,
            margin: '0 auto',
            padding: token.paddingLG,
            background: token.colorBgLayout,
            minHeight: '100vh',
        },
        headerCard: {
            background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorBgContainer} 100%)`,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            marginBottom: token.marginLG,
        },
        sectionCard: {
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadow,
            height: '100%',
        },
        avatarSection: {
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            padding: token.paddingXL,
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgElevated,
        },
        statItem: {
            textAlign: 'center' as const,
            padding: token.paddingMD,
        },
        skillTag: {
            marginBottom: token.marginXS,
            background: token.colorPrimaryBg,
            color: token.colorPrimary,
            border: `1px solid ${token.colorPrimaryBorder}`,
            borderRadius: token.borderRadiusSM,
        },
        timelineItem: {
            fontSize: token.fontSizeSM,
            color: token.colorTextSecondary,
        },
        editButton: {
            background: token.colorPrimary,
            color: token.colorTextLightSolid,
            border: 'none',
            borderRadius: token.borderRadius,
        },
        cancelButton: {
            background: token.colorBgContainer,
            color: token.colorText,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadius,
        },
    };

    return (
        <div style={styles.container}>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8}>
                    <Card style={styles.headerCard}>
                        <div style={styles.avatarSection}>
                            <Badge dot color='green' offset={[-5, 80]}>
                                <Avatar
                                    size={120}
                                    src={user?.avatar}
                                    icon={<UserOutlined />}
                                    style={{
                                        border: `4px solid ${token.colorPrimaryBorder}`,
                                        marginBottom: token.marginLG,
                                    }}
                                />
                            </Badge>

                            <Title
                                level={3}
                                style={{
                                    marginBottom: token.marginXS,
                                    color: token.colorTextHeading,
                                }}
                            >
                                Алексей Петров
                            </Title>

                            <Space
                                direction='vertical'
                                size='small'
                                style={{
                                    width: '100%',
                                    marginTop: token.marginLG,
                                }}
                            >
                                <Button
                                    type='primary'
                                    icon={<EditOutlined />}
                                    block
                                    style={styles.editButton}
                                >
                                    Редактировать профиль
                                </Button>

                                <Upload
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={() =>
                                        message.success('Аватар обновлен')
                                    }
                                >
                                    <Button
                                        icon={<CameraOutlined />}
                                        block
                                        style={styles.cancelButton}
                                    >
                                        Сменить фото
                                    </Button>
                                </Upload>
                            </Space>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={16}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24}>
                            <Card
                                style={styles.sectionCard}
                                title={
                                    <Space>
                                        <UserOutlined />
                                        <span>Контактная информация</span>
                                    </Space>
                                }
                                extra={
                                    <Button
                                        type='text'
                                        icon={<EditOutlined />}
                                        size='small'
                                    >
                                        Изменить
                                    </Button>
                                }
                            >
                                <Row gutter={[24, 16]}>
                                    <Col xs={24} md={12}>
                                        <Space
                                            direction='vertical'
                                            size='small'
                                            style={{width: '100%'}}
                                        >
                                            <div>
                                                <Text strong>Email:</Text>
                                                <Paragraph
                                                    style={{marginBottom: 0}}
                                                >
                                                    <MailOutlined
                                                        style={{
                                                            marginRight:
                                                                token.marginXS,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                    alexey.petrov@example.com
                                                </Paragraph>
                                            </div>

                                            <div>
                                                <Text strong>Телефон:</Text>
                                                <Paragraph
                                                    style={{marginBottom: 0}}
                                                >
                                                    <PhoneOutlined
                                                        style={{
                                                            marginRight:
                                                                token.marginXS,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                    +7 (999) 123-45-67
                                                </Paragraph>
                                            </div>

                                            <div>
                                                <Text strong>Локация:</Text>
                                                <Paragraph
                                                    style={{marginBottom: 0}}
                                                >
                                                    <EnvironmentOutlined
                                                        style={{
                                                            marginRight:
                                                                token.marginXS,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                    Москва, Россия
                                                </Paragraph>
                                            </div>
                                        </Space>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Space
                                            direction='vertical'
                                            size='small'
                                            style={{width: '100%'}}
                                        >
                                            <div>
                                                <Text strong>Веб-сайт:</Text>
                                                <Paragraph
                                                    style={{marginBottom: 0}}
                                                >
                                                    <GlobalOutlined
                                                        style={{
                                                            marginRight:
                                                                token.marginXS,
                                                            color: token.colorPrimary,
                                                        }}
                                                    />
                                                    https://alexey.dev
                                                </Paragraph>
                                            </div>

                                            <div>
                                                <Text strong>GitHub:</Text>
                                                <Paragraph
                                                    style={{marginBottom: 0}}
                                                >
                                                    @alexeydev
                                                </Paragraph>
                                            </div>

                                            <div>
                                                <Text strong>Telegram:</Text>
                                                <Paragraph
                                                    style={{marginBottom: 0}}
                                                >
                                                    @alexey_petrov
                                                </Paragraph>
                                            </div>
                                        </Space>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24}>
                            <Card
                                style={styles.sectionCard}
                                title={
                                    <Space>
                                        <SettingOutlined />
                                        <span>Настройки профиля</span>
                                    </Space>
                                }
                            >
                                <Space
                                    direction='vertical'
                                    size='middle'
                                    style={{width: '100%'}}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Space>
                                            <BellOutlined />
                                            <Text>Уведомления на почту</Text>
                                        </Space>
                                        <Switch defaultChecked />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Space>
                                            <LockOutlined />
                                            <Text>
                                                Двухфакторная аутентификация
                                            </Text>
                                        </Space>
                                        <Switch />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Space>
                                            <GlobalOutlined />
                                            <Text>Публичный профиль</Text>
                                        </Space>
                                        <Switch defaultChecked />
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Space>
                                            <HeartOutlined />
                                            <Text>Показывать активность</Text>
                                        </Space>
                                        <Switch defaultChecked />
                                    </div>
                                </Space>

                                <Divider
                                    style={{margin: `${token.margin}px 0`}}
                                />

                                <Form layout='vertical'>
                                    <Form.Item label='Язык интерфейса'>
                                        <Select
                                            defaultValue='ru'
                                            style={{width: '100%'}}
                                        >
                                            <Option value='ru'>Русский</Option>
                                            <Option value='en'>English</Option>
                                            <Option value='de'>Deutsch</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label='Часовой пояс'>
                                        <Select
                                            defaultValue='moscow'
                                            style={{width: '100%'}}
                                        >
                                            <Option value='moscow'>
                                                Москва (UTC+3)
                                            </Option>
                                            <Option value='london'>
                                                Лондон (UTC+0)
                                            </Option>
                                            <Option value='newyork'>
                                                Нью-Йорк (UTC-5)
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>

                        <Col xs={24}>
                            <Card style={styles.sectionCard}>
                                <Space
                                    size='large'
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Tooltip title='Сохранить все изменения'>
                                        <Button
                                            type='primary'
                                            size='large'
                                            icon={<SaveOutlined />}
                                            style={styles.editButton}
                                        >
                                            Сохранить изменения
                                        </Button>
                                    </Tooltip>

                                    <Button
                                        size='large'
                                        icon={<LogoutOutlined />}
                                        danger
                                        style={styles.cancelButton}
                                    >
                                        Выйти из аккаунта
                                    </Button>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
