import { Icon } from 'gatsby-plugin-substrate';
import React from 'react';

import SecondaryButton from './SecondaryButton';

export default function Feedback() {
  const githubLink = 'https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose';
  return (
    <div>
      <SecondaryButton external link={githubLink}>
        <div className="flex items-center pt-2 mb-2">
          <span className="font-semibold">Submit an issue</span>
          <Icon name="github" width="20" className="m-2 fill-current dark:text-substrateDark text-substrateWhite" />
          <Icon name="external-link" width="20" className="fill-current dark:text-substrateDark text-substrateWhite" />
        </div>
      </SecondaryButton>
    </div>
  );
}
