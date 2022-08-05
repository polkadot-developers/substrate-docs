import { useEffect, useState } from 'react';

import { isBrowser } from '../utils/browser';

const getSessionStorageOrDefault = (key, defaultValue) => {
  const stored = isBrowser && window.sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
};

const useSessionStorage = (key, defaultValue) => {
  const [value, setValue] = useState(getSessionStorageOrDefault(key, defaultValue));

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export { useSessionStorage };
