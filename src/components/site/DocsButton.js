import React from 'react';

import Icon from '../default/Icon';
import { Link } from '../default/Link';

export default function DocsButton() {
  const docsLink = '/';

  return (
    // TODO: add docs link
    // TODO: add docs title i18n
    <Link to={docsLink} className="block opacity-100 transform transition duration-300 ease-in-out hover:opacity-80">
      <button className="flex items-center justify-center bg-substrateDark dark:bg-white text-sm py-2 w-20 rounded focus:outline-none fill-same text-white dark:text-black">
        <Icon name="docsNavIcon" className="fill-same text-substrateDark dark:text-white" />
        <span className="pl-2">Docs</span>
      </button>
    </Link>
  );
}
