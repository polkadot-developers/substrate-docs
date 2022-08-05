import cx from 'classnames';
import React from 'react';

const Article = ({ className, children }) => {
  return <article className={cx(className)}>{children}</article>;
};

export { Article };
