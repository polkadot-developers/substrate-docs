import React from 'react';

import { Link } from '../Link';

function LinkResolver({ children, href, ...others }) {
  return (
    <Link to={href} {...others}>
      {children}
    </Link>
  );
}

export { LinkResolver as a };
