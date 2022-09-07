import { Icon, Link } from 'gatsby-plugin-substrate';
import React from 'react';

export default function Feedback() {
  const githubLink = 'https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose';
  return (
    <div className="h-[40px] w-full bg-substrateBlackish dark:bg-substrateDarkThemeLightGrey inline-block rounded-md hover:opacity-80">
      <Link to={githubLink}>
        <div className="items-center justify-center flex mx-auto w-full text-white dark:text-black px-5 py-1.5">
          <Icon name="github" width="16" className="mr-2 fill-current" />
          <span className="text-sm block hover:opacity-80">Submit an issue</span>
        </div>
      </Link>
    </div>
  );
}
