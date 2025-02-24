import cx from 'classnames';
import React from 'react';

import useActiveId from '../../hooks/use-active-id';

export default function TableOfContents({ data, headings }) {
  function getIds(items) {
    return items.reduce((acc, item) => {
      if (item.id) {
        // url has a # as first character, remove it to get the raw CSS-id
        acc.push(item.id);
      }
      if (item.items) {
        acc.push(...getIds(item.items));
      }
      return acc;
    }, []);
  }
  const idList = getIds(headings);
  const activeId = useActiveId(idList);
  return (
    <>
      <div className="w-100 ml-0 overflow-auto max-h-[calc(100vh-theme(space.20))] top-20 sticky">
        {data && (
          <div className="font-semibold mb-5 mx-1 pt-9 table-of-contents">
            <div className="mb-5">ON THIS PAGE</div>
            <div className="mt-5 text-left block">
              {headings.map(heading => (
                <a href={`#${heading.id}`} key={heading.id}>
                  <p
                    className={cx('mb-4 ml-0 text-sm hover:opacity-100 opacity-80', {
                      'text-substrateBlue dark:text-substrateBlue-light !opacity-100 cursor-default':
                        activeId === heading.id,
                    })}
                  >
                    {heading.value}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
