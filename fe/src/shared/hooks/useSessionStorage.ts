import {useCallback, useState} from 'react';

export function useSessionStorage<T>(key: string, initialValue?: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.sessionStorage.getItem(key);
            if (item === null) {
                return initialValue;
            }

            if (typeof initialValue === 'string') {
                return item as unknown as T;
            }

            return JSON.parse(item);
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;

                setStoredValue(valueToStore);

                if (typeof window !== 'undefined') {
                    if (typeof valueToStore === 'string') {
                        window.sessionStorage.setItem(key, valueToStore);
                    } else {
                        window.sessionStorage.setItem(
                            key,
                            JSON.stringify(valueToStore)
                        );
                    }
                }
            } catch (error) {
                console.error(
                    `Error setting sessionStorage key "${key}":`,
                    error
                );
            }
        },
        [key, storedValue]
    );

    const removeValue = useCallback(() => {
        try {
            setStoredValue(undefined as T);
            if (typeof window !== 'undefined') {
                window.sessionStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing sessionStorage key "${key}":`, error);
        }
    }, [key]);

    return [storedValue, setValue, removeValue] as const;
}
