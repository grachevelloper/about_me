import Cookies from 'js-cookie';
import {useCallback, useState} from 'react';

export const useCookie = <T extends string = string>(
    key: string,
    initialValue?: T
) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = Cookies.get(key);
            if (item) return item as T;
            return initialValue ?? ('' as T);
        } catch (error) {
            console.error('Error reading cookie:', error);
            return initialValue ?? ('' as T);
        }
    });

    const setValue = useCallback(
        (
            value: T | ((val: T | null) => T),
            options?: Cookies.CookieAttributes
        ) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;

                setStoredValue(valueToStore);
                Cookies.set(key, valueToStore, {
                    expires: 365,
                    path: '/',
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    ...options,
                });
            } catch (error) {
                console.error('Error setting cookie:', error);
            }
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        try {
            Cookies.remove(key, {path: '/'});
            setStoredValue(initialValue ?? ('' as T));
        } catch (error) {
            console.error('Error removing cookie:', error);
        }
    }, [key, initialValue]);

    return {value: storedValue, setValue, removeValue};
};
