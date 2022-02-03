import './src/styles/global.css';
import './src/styles/markdown.css';
import './src/styles/custom-blocks.css';
import './src/styles/language-tabs.css';
import './src/styles/scss/styles.scss';
import 'gatsby-prismjs-dracula';

import React from 'react';

import { DataProvider } from './src/contexts/DataContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

export const wrapRootElement = ({ element }) => <ThemeProvider>{element}</ThemeProvider>;

export const wrapPageElement = ({ element, props }) => <DataProvider props={props}>{element}</DataProvider>;

export const onRouteUpdate = ({ location }) => scrollToAnchor(location);

/**
 *
 * @desc - a function to jump to the correct scroll position
 * @param {Object} location -
 * @param {Number} [mainNavHeight] - the height of any persistent nav -> document.querySelector(`nav`)
 */
function scrollToAnchor(location, mainNavHeight = 100) {
  // Check for location so build does not fail
  if (location && location.hash) {
    // Fix scrolling for ids starting with numbers
    // https://stackoverflow.com/a/20306237/1268612
    const hash = location.hash.replace(/^#(\d)/, '#\\3$1');
    const item = document.querySelector(`${hash}`);

    if (item)
      window.scrollTo({
        top: item.offsetTop - mainNavHeight,
        behavior: 'instant',
      });
  } else if (location) {
    window.scrollTo(0, 0);
  }

  return true;
}
