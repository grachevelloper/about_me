import {Col, Divider, Row, Skeleton} from 'antd';

export const BaseDetailsSkeleton = () => {
    return (
        <>
            <Divider orientation='left'>
                <Skeleton.Input
                    active
                    size='default'
                    style={{width: 200, height: 32}}
                />
            </Divider>
            <Row gutter={16} style={{marginBottom: 16}}>
                <Col>
                    <Skeleton.Button
                        active
                        size='small'
                        style={{width: 80, height: 24}}
                    />
                </Col>
                <Col>
                    <Skeleton.Button
                        active
                        size='small'
                        style={{width: 100, height: 24}}
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Skeleton active paragraph={{rows: 6}} title={false} />
                </Col>
                <Col xs={24} lg={12}>
                    <Skeleton
                        active
                        paragraph={{rows: 4}}
                        title={{width: '60%'}}
                    />
                    <Skeleton
                        active
                        paragraph={{rows: 3}}
                        title={{width: '50%'}}
                        style={{marginTop: 16}}
                    />
                </Col>
            </Row>
        </>
    );
};
