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
  document.execCommand('copy');
  document.body.removeChild(el);
};

function Code({ children, className }) {
  const [isCopied, setIsCopied] = useState(false);
  if (className && !className.includes('language-text') && className.includes('language-')) {
    return (
      <div>
        <pre className={className}>{children}</pre>
        <button
          onClick={() => {
            copyToClipboard(Children.onlyText(children));
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1300);
          }}
          className="sm:w-20 sm:block absolute top-0 bottom-0 right-0 dark:fill-whitetext-small hover-fill-green"
        >
          {isCopied ? (
            <span className="text-green w-100 mr-2">Copied</span>
          ) : (
            <Icon name="copy" className="h-50 w-20 mx-auto block fill-current" />
          )}
        </button>
      </div>
    );
  } else if (className && className.includes('language-text')) {
    return <pre className={className}>{children}</pre>;
  } else return <pre className={className}>{children}</pre>;
}

export { Code };
