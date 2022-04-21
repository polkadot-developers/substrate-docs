import React from 'react';

import Icon from '../default/Icon';

export default function EditOnGithubButton({ link }) {
  return (
    // TODO: add docs link
    // TODO: add docs title i18n
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block opacity-100 transform transition duration-300 ease-in-out hover:opacity-80"
    >
      <button className="flex items-center justify-center bg-substrateDark dark:bg-white  text-sm py-2 w-40 rounded focus:outline-none fill-current text-white dark:text-black">
        <Icon name="github" width="22" />
        <span className="pl-2">Edit on Github</span>
      </button>
    </a>
  );
}
