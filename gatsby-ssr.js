import React from 'react';

import { DataProvider } from './src/contexts/DataContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

const MagicScriptTag = () => {
  const codeToRunOnClient = `
  (function() {
    function getInitialColorMode() {
        const persistedColorPreference = localStorage.theme;
        const hasPersistedPreference = typeof persistedColorPreference === 'string';

        if (hasPersistedPreference) {
          return persistedColorPreference;
        }

        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const hasMediaQueryPreference = typeof mql.matches === 'boolean';
        if (hasMediaQueryPreference) {
          return mql.matches ? 'dark' : 'light';
        }

        return 'light';
    }
    const colorMode = getInitialColorMode();

    document.documentElement.classList.add(colorMode);
  })()
    `;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />;
};

export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<MagicScriptTag key={1} />);
};

export const wrapRootElement = ({ element }) => <ThemeProvider>{element}</ThemeProvider>;

export const wrapPageElement = ({ element, props }) => <DataProvider props={props}>{element}</DataProvider>;
