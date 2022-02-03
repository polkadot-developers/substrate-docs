import React from 'react';

const serializePathname = pathname => {
  // trailing slash would add empty array item
  if (pathname !== '/') pathname = pathname.replace(/\/$/, '');

  const pathnames = pathname.toString().split('/');
  // remove empty string item before first '/'
  pathnames.shift();
  return pathnames;
};

const toTitleCase = str => {
  str = str.replace(/[-]/g, ' ');
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// TODO: sequencialize data context

const pageSlug = pathArray => {
  return pathArray[pathArray.length - 1];
};

const pageTitle = pathArray => {
  const pageSlug = pathArray[pathArray.length - 1];
  return toTitleCase(pageSlug);
};

const defaultContext = {
  pathArray: new Array('', '', ''),
  pageTitle: '',
};

const DataContext = React.createContext(defaultContext);

const DataProvider = ({ children, props }) => {
  const { location, pageContext } = props;

  return (
    <DataContext.Provider
      value={{
        location,
        pathArray: serializePathname(location.pathname),
        pageSlug: pageSlug(serializePathname(location.pathname)),
        pageTitle: pageTitle(serializePathname(location.pathname)),
        pageContext,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
export { DataProvider };
