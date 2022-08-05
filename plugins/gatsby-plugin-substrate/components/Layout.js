import AOS from 'aos';
import cx from 'classnames';
import React, { useEffect } from 'react';

import { ArticleNav } from './ArticleNav';
import { Banner } from './Banner';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavBreadcrumb } from './NavBreadcrumb';
import { NavSidebar } from './NavSidebar';

const LayoutSidebar = ({ children, hasArticleNav, hasBreadcrumbs, navSidebarData }) => {
  return (
    <div className="flex">
      <div className="hidden lg:block min-h-screen lg:h-auto lg:bg-substrateGray-light border-r lg:dark:bg-substrateBlackish dark:border-substrateDarkThemeGrey">
        <div className={cx(`sticky top-16 overflow-y-auto w-64`)}>
          <NavSidebar data={navSidebarData} />
        </div>
      </div>
      <div className="w-full 2xl:pr-64 pt-10">
        <article
          className={cx('m-auto lg:max-w-6xl', {
            flex: hasArticleNav,
          })}
        >
          <div
            className={cx({
              'xl:w-2/3': hasArticleNav,
            })}
          >
            {hasBreadcrumbs && (
              <div className="container hidden md:block lg:px-10 lg:max-w-6xl m-auto mb-10 underline-animate underline-animate-thin">
                <NavBreadcrumb />
              </div>
            )}
            {children}
          </div>
          {hasArticleNav && (
            <div className="xl:w-1/3 hidden xl:block">
              <div className="sticky top-16 pt-16 -mt-16 pb-8">
                <ArticleNav />
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

const Layout = ({
  layout = 'default',
  mode = 'default',
  header = 'default',
  children,
  hasArticleNav = false,
  hasBreadcrumbs = true,
  navSidebarData = [],
  showFooterNewsletter = true,
}) => {
  useEffect(() => {
    AOS.init({
      disable: 'mobile',
      duration: 600,
    });
  }, []);

  return (
    <>
      <Banner />
      <Header mode={mode} header={header} />
      <main
        className={cx('min-h-screen', {
          'mt-12': layout === 'default',
        })}
      >
        {layout === 'default' && <>{children}</>}
        {layout === 'sidebar' && (
          <LayoutSidebar hasArticleNav={hasArticleNav} hasBreadcrumbs={hasBreadcrumbs} navSidebarData={navSidebarData}>
            {children}
          </LayoutSidebar>
        )}
      </main>
      <Footer showNewsletter={showFooterNewsletter} />
    </>
  );
};

export { Layout };
