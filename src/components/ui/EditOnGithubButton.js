import React from 'react';

import Icon from '../default/Icon';

const githubLink = 'https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose';

export default function EditOnGithubButton({ link, text }) {
  return (
    // TODO: add docs link
    // TODO: add docs title i18n
    <div className="flex justify-items-end items-center">
      <Icon name="github" width="18" className="fill-opposite mb-1" />{' '}
      <a
        href={link}
        className="inline px-1 mb-0 text-sm text-substrateDark dark:text-white before:hidden opacity-100 transform transition duration-300 ease-in-out hover:opacity-80 justify-items-end items-center hover:before:hidden"
      >
        {text}
      </a>
      <span> | </span>
      <a
        href={githubLink}
        rel="noopener noreferrer"
        className="inline pl-1 mb-0 text-sm text-substrateDark dark:text-white before:hidden opacity-100 transform transition duration-300 ease-in-out hover:opacity-80 justify-items-end items-center hover:before:hidden"
      >
        Submit an issue
      </a>
    </div>
  );
}
