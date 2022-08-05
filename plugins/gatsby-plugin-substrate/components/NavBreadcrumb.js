import { Breadcrumb } from 'gatsby-plugin-breadcrumb';
import React from 'react';

import { DataContext } from '../contexts/DataContext';

const NavBreadcrumb = ({ linkMiddleParent = false }) => {
  return (
    <DataContext.Consumer>
      {({ pageContext, pathArray, pageTitle }) => (
        <Breadcrumb
          crumbs={pageContext.breadcrumb.crumbs}
          crumbSeparator=""
          crumbLabel={pageTitle}
          hiddenCrumbs={['/']}
          /* keep parent as a link and disable children links (eg):
          "/<ecosystem>/resources/awesome-substrate" and "/<ecosystem>/resources/" */
          disableLinks={[
            `/${pathArray[0]}/${pathArray[1]}/${pathArray[2]}`,
            !linkMiddleParent ? `/${pathArray[0]}/${pathArray[1]}` : '',
          ]}
          className="breadcrumb__list breadcrumb__list__item breadcrumb__separator breadcrumb__link breadcrumb__link__active"
        />
      )}
    </DataContext.Consumer>
  );
};

export { NavBreadcrumb };
