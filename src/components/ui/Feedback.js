import React from 'react';

import Icon from '../default/Icon';
import { Link } from '../default/Link';

export default function Feedback() {
  const githubLink = 'https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose';
  return (
    <div className="w-full pt-2 pb-2 px-4 text-left bg-gray-100 rounded">
      <Link to={githubLink}>
        <div className="flex items-center justify-center block mx-auto w-full text-black">
          <span className="text-sm block hover:opacity-80">Submit an issue</span>
          <Icon name="github" width="14" className="m-2 fill-current" />
        </div>
      </Link>
    </div>
  );
}
