import React from 'react';

import Icon from '../default/Icon';

const githubLink = 'https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose';

export default function EditOnGithubButton({ link, text }) {
  return (
    // TODO: add docs link
    // TODO: add docs title i18n
    <div className="flex group justify-items-end items-center">
      <Icon
        name="github"
        width="16"
        className="fill-opposite mb-0.5 opacity-50 group-hover:opacity-100 transform transition duration-300 ease-in-out"
      />{' '}
      <a
        href={link}
        className="inline-flex h-full pl-2 pr-1 mb-0 text-sm text-substrateDark dark:text-white before:hidden opacity-50 transform transition duration-300 ease-in-out hover:opacity-100 justify-items-end items-center hover:before:hidden"
      >
        {text}
      </a>
      <span className="opacity-50"> | </span>
      <a
        href={githubLink}
        rel="noopener noreferrer"
        className="inline-flex h-full pl-1 mb-0 text-sm text-substrateDark dark:text-white before:hidden opacity-50 transform transition duration-300 ease-in-out hover:opacity-100 justify-items-end items-center hover:before:hidden"
      >
        Submit an issue
      </a>
    </div>
  );
}
