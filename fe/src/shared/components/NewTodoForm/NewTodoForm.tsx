import {Form, Modal, Typography} from 'antd';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {DtoCreateTodo} from '@/todos/api/types';

import {useCreateTodoMutation} from '../../../units/todos/hooks';
import {useTodoForm} from '../../context';
import {useLocalStorage} from '../../hooks';
import {NEW_TODO_KEY} from '../../utils/constants';
import {FormInput} from '../FormInput';
import {FormField} from '../FormInput/types';

interface NewTodoFormProps {
    isSuggest?: boolean;
}

const todoDefault: DtoCreateTodo = {
    content: '',
    title: '',
};

export const NewTodoForm = ({isSuggest = false}: NewTodoFormProps) => {
    const {mutateAsync, isError, isPending} = useCreateTodoMutation();
    const {t: tTodo} = useTranslation('todo');
    const [form] = Form.useForm();
    const {isOpen, setIsOpen} = useTodoForm();
    const [localValue, setLocalValue] = useLocalStorage(
        NEW_TODO_KEY,
        todoDefault
    );

    const handleValuesChange = (changedValues: Partial<DtoCreateTodo>) => {
        setLocalValue((prev) => ({
            ...prev,
            ...changedValues,
        }));
    };

    useEffect(() => {
        if (isOpen && localValue) {
            form.setFieldsValue(localValue);
        }
    }, [isOpen, localValue, form]);

    const inputFields: FormField[] = [
        {
            label: tTodo('todo.table.col.todo'),
            name: 'title',
            placeholder: tTodo('new-todo-form.your-title.placeholder'),
        },
        {
            label: tTodo('todo.table.col.content'),
            name: 'content',
            type: 'text',
            placeholder: tTodo('new-todo-form.your-content.placeholder'),
        },
    ];

    const handleOk = () => {
        if (!isSuggest) {
            mutateAsync(localValue);
        }
        setIsOpen(false);
        setLocalValue(todoDefault);
    };

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <Modal
            open={isOpen}
            okText={tTodo('new-todo-form.ok')}
            cancelText={tTodo('new-todo-form.close')}
            onCancel={handleCancel}
            onOk={handleOk}
            okButtonProps={{
                loading: isPending,
            }}
        >
            <Form
                form={form}
                layout='vertical'
                onValuesChange={handleValuesChange}
                onFinish={handleOk}
            >
                <Typography.Title>
                    {tTodo('new-todo-form.title')}
                </Typography.Title>
                {inputFields.map((field: FormField, index) => (
                    <FormInput key={index} field={field} />
                ))}
            </Form>
        </Modal>
    );
};
