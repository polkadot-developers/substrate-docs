import React, { useState } from 'react';
import Children from 'react-children-utilities';

import Icon from '../Icon';

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  navigator.clipboard.writeText(el.value);
  document.body.removeChild(el);
};

function Code({ children, className }) {
  const [isCopied, setIsCopied] = useState(false);
  if (className && !className.includes('language-text') && className.includes('language-')) {
    return (
      <pre className={className}>
        {children}
        <button
          onClick={() => {
            copyToClipboard(Children.onlyText(children));
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1300);
          }}
          className="z-50 absolute top-0 bottom-0 right-0 dark:fill-white p-1 text-small w-20 hover-fill-green"
        >
          {isCopied ? (
            <span className="text-green">Copied</span>
          ) : (
            <Icon name="copy" className="h-50 w-50 mx-auto block fill-current" />
          )}
        </button>
      </pre>
    );
  } else if (className && className.includes('language-text')) {
    return <pre className={className}>{children}</pre>;
  } else return <pre className={className}>{children}</pre>;
}

export { Code };
