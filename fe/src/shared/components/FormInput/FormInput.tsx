import {Form, Input, InputProps} from 'antd';
import {TextAreaProps} from 'antd/es/input';

import {FormField} from './types';

interface FormInputProps {
    field: FormField;
}

const {TextArea} = Input;

export function FormInput({field}: FormInputProps) {
    const {
        name,
        label,
        dependencies,
        rules,
        type,
        placeholder,
        className,
        rootClassName,
    } = field;

    const formInputBaseProps: InputProps = {
        placeholder,
        variant: 'underlined',
        className: rootClassName,
    };

    const renderInput = () => {
        switch (type) {
            case 'password':
                return <Input.Password {...formInputBaseProps} />;
            case 'email':
                return <Input type='email' {...formInputBaseProps} />;
            case 'text':
                return (
                    <TextArea
                        {...(formInputBaseProps as TextAreaProps)}
                        variant='outlined'
                        style={{resize: 'none'}}
                        autoSize={{
                            maxRows: 6,
                            minRows: 2,
                        }}
                    />
                );
            default:
                return <Input {...formInputBaseProps} />;
        }
    };

    return (
        <Form.Item
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            name={name}
            label={label}
            rules={rules}
            dependencies={dependencies}
            className={className}
        >
            {renderInput()}
        </Form.Item>
    );
}
