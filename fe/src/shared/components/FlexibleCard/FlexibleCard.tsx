import {Card, CardProps, Flex} from 'antd';
import block from 'bem-cn-lite';
import React from 'react';

const b = block('flexible-card');

interface FlexibleCardProps extends Omit<CardProps, 'actions'> {
    actions?: React.ReactNode[];
    actionsAlign?:
        | 'start'
        | 'center'
        | 'end'
        | 'space-between'
        | 'space-around';
    actionsVertical?: boolean;
    className?: string;
}

export const FlexibleCard: React.FC<FlexibleCardProps> = ({
    actions = [],
    actionsAlign = 'end',
    actionsVertical = false,
    className,
    children,
    ...cardProps
}) => {
    return (
        <Card {...cardProps} className={b(undefined, className)}>
            {children}

            {actions && actions.length > 0 && (
                <Flex
                    gap='small'
                    justify={actionsAlign}
                    align='start'
                    vertical={actionsVertical}
                    className={b('actions')}
                >
                    {actions.map((action, index) => (
                        <div key={index} className={b('action-item')}>
                            {action}
                        </div>
                    ))}
                </Flex>
            )}
        </Card>
    );
};
