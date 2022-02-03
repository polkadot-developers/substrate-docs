import cx from 'classnames';
import React from 'react';

export default function Layout({ className, children }) {
  return <article className={cx(className)}>{children}</article>;
}
