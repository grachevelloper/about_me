import {useEffect} from 'react';

import {UpdateDraftField} from '../types';
import {updateErrorHandler} from '../utils/updateErrorHandler';

export const useUpdateErrors = (errors: UpdateDraftField[]) => {
    const {contextHolder, showNotification} = updateErrorHandler(errors);

    useEffect(() => {
        if (errors.length > 0) {
            showNotification();
        }
    }, [errors, showNotification]);

    return contextHolder;
};
