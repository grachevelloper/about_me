import {Form, FormInstance} from 'antd';
import {useEffect, useState} from 'react';

export function useFieldValidation<T>(form: FormInstance, fieldName: string) {
    const fieldValue = Form.useWatch<T>(fieldName, form);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        if (!fieldValue) {
            setIsValid(false);
            return;
        }

        void form
            .validateFields([fieldName], {validateOnly: true})
            .then(() => {
                if (isCurrent) {
                    setIsValid(true);
                }
            })
            .catch(() => {
                if (isCurrent) {
                    setIsValid(false);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [fieldValue, fieldName, form]);

    return isValid;
}
