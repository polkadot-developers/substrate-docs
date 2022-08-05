import { useCallback, useEffect, useState } from 'react';

const useHubspot = formId => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const handler = useCallback(
    event => {
      if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
        if (event.data.id === formId) {
          setFormSubmitted(true);
        }
      }
    },
    [formId]
  );

  useEffect(() => {
    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
    };
  }, [handler]);

  const onFormReady = useCallback(() => {
    setIsFormReady(true);
  }, []);

  return { formSubmitted, isFormReady, onFormReady };
};

export { useHubspot };
