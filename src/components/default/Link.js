import { Link as LinkI18n } from 'gatsby-plugin-react-i18next';
import React, { useContext } from 'react';

import { ThemeContext } from '../../contexts/ThemeContext';

const addTrailingSlash = uri => {
  const addSlash = uri => {
    uri += uri.endsWith('/') ? '' : '/';
    return uri;
  };

  const removeSlash = uri => {
    return uri.replace(/\/$/, '');
  };

  const getHash = uri => {
    if (uri.indexOf('#') > 0) {
      return uri.substring(uri.indexOf('#'), uri.length);
    }
    return '';
  };

  const getSearch = uri => {
    if (uri.indexOf('?') > 0) {
      return uri.substring(uri.indexOf('?'), uri.length);
    }
    return '';
  };

  // eg: http://localhost:8001/playground/?deploy=node-template#config
  // remove back slash if exist
  uri = removeSlash(uri);
  // store hash if exist and remove from uri
  const hash = getHash(uri);
  if (hash) uri = uri.replace(hash, '');
  // remove back slash if exist
  uri = removeSlash(uri);
  // store search query if exist and remove from uri
  const search = getSearch(uri);
  if (search) uri = uri.replace(search, '');
  // add slash if missing
  uri = addSlash(uri);

  return uri + search + hash;
};

const addLeadingSlash = uri => {
  return (uri = uri.startsWith('/') ? uri : '/'.concat(uri));
};

const addSlashes = uri => {
  return addLeadingSlash(addTrailingSlash(uri));
};

const InfraLink = ({ to, title, children, ...other }) => {
  const { colorMode } = useContext(ThemeContext);

  const handleClick = (e, to) => {
    e.preventDefault();
    window.location.href = addTrailingSlash(to) + `?mode=${colorMode}`;
  };

  return (
    <a href={addTrailingSlash(to)} title={title} onClick={e => handleClick(e, to)} {...other}>
      {children}
    </a>
  );
};

const Link = ({ to, title, children, ...other }) => {
  const external = testExternalLink(to);
  const infraLink = testInfraLink(to);

  if (external) {
    return (
      <a href={to} title={title} {...other} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  } else if (infraLink) {
    return (
      <InfraLink to={to} title={title} {...other}>
        {children}
      </InfraLink>
    );
  } else {
    return (
      <LinkI18n to={addSlashes(to)} title={title} {...other}>
        {children}
      </LinkI18n>
    );
  }
};

const LinkMenu = ({ prefix, slug, title, children, ...other }) => {
  const external = testExternalLink(slug);
  const infraLink = testInfraLink(slug);
  if (external) {
    return (
      <a href={slug} {...other} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  } else if (infraLink) {
    return (
      <InfraLink to={slug} title={title} {...other}>
        {children}
      </InfraLink>
    );
  } else {
    return (
      <LinkI18n to={addSlashes(prefix + slug)} {...other}>
        {children}
      </LinkI18n>
    );
  }
};

const buildSubMenu = (menus, item) => {
  return menus[item.id];
};

const testInfraLink = href => {
  const regexList = [
    new RegExp(process.env.GATSBY_WEBSITE_URL, 'i'),
    new RegExp(process.env.GATSBY_DOCS_URL, 'i'),
    new RegExp(process.env.GATSBY_MARKETPLACE_URL, 'i'),
  ];
  const match = regexList.some(rx => rx.test(href));
  return match;
};

const testExternalLink = href => {
  if (testInfraLink(href)) {
    return false;
  }
  const regex = new RegExp('^(http|https)://', 'i');
  const match = regex.test(href);
  return match;
};

export { Link, buildSubMenu, testExternalLink, testInfraLink, LinkMenu };
