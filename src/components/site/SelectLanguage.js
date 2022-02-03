import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';

import { Link } from '../default/Link';

const SelectLanguage = () => {
  const { languages, originalPath } = useI18next();
  const links = languages.map(lang => (
    <li key={lang}>
      <Link to={originalPath} language={lang}>
        {lang}
      </Link>
    </li>
  ));

  return <ul>{links}</ul>;
};

export default SelectLanguage;
