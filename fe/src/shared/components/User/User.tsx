import {Avatar, Flex, Typography} from 'antd';

import {type User as UserType} from '@/typings/entities';

interface UserProps {
    data: UserType;
}

export const User = ({data}: UserProps) => {
    const {avatar, username} = data;
    return (
        <Flex justify='start'>
            <Avatar />
            <Typography.Title level={4}>{username}</Typography.Title>
        </Flex>
    );
};
