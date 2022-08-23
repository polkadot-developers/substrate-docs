import { Link } from 'gatsby-plugin-substrate';
import React from 'react';

function LinkResolver({ children, href, ...others }) {
  return (
    <Link to={href} {...others}>
      {children}
    </Link>
  );
}

export { LinkResolver as a };
