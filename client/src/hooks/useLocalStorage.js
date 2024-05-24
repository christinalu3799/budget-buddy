import { useState } from 'react';

const useLocalStorage = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);

            if (value) {
                return JSON.parse(value);
            } else {
                window.localStorage.setItem(
                    keyName,
                    JSON.stringify(defaultValue)
                );
                return defaultValue;
            }
        } catch (e) {
            console.log('Failed to use local storage. Error: ', e.message);
            return defaultValue;
        }
    });

    const setValue = (newValue) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (e) {
            console.log(e);
        }

        setStoredValue(newValue);
    };
    return [storedValue, setValue];
};

export default useLocalStorage;
