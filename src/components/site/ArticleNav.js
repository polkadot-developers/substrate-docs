import cx from 'classnames';
import React, { useState } from 'react';

import useHeadingsData from '../../hooks/use-headings-data';
import useIntersectionObserver from '../../hooks/use-intersection-observer';

const ArticleNav = () => {
  const [activeId, setActiveId] = useState();
  const headings = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <nav aria-label="Table of contents" className="max-h-full overflow-auto">
      <Headings headings={headings} activeId={activeId} />
    </nav>
  );
};

const Headings = ({ headings, activeId }) => {
  return (
    <ul className={cx('p-0 m-0 pr-4 mb-20 list-none transition-all')}>
      <span className="block mb-3 font-semibold">CONTENT</span>
      {headings.map(({ title, id }) => (
        <li key={id} className="p-0 m-0 mb-2">
          <a href={`#${id}`} className={`${id === activeId && 'font-semibold'} hover:font-bold`}>
            {title}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default ArticleNav;
