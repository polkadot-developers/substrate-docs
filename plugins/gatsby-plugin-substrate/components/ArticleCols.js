import cx from 'classnames';
import React from 'react';

import { ArticleNav } from './ArticleNav';

const ArticleCols = ({ className, children }) => {
  return (
    <article className={cx(className)}>
      <div className="container mb-20 lg:px-10">
        <div className="flex flex-row">
          <div className="xl:w-2/3 md:px-8 xl:pl-8">{children}</div>
          <div className="xl:w-1/3 hidden xl:block xl:pl-16">
            <div className="sticky top-16 pt-16 -mt-16 overflow-y-auto">
              <ArticleNav />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export { ArticleCols };
