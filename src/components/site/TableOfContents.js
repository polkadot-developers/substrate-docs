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
      <div className="w-100 sticky top-20 max-h-[calc(100vh)] pb-32 ml-0 overflow-y-auto overscroll-contain">
        {data && (
          <div className="font-semibold mb-5 mr-1 pt-9 table-of-contents">
            <div className="mb-5">ON THIS PAGE</div>
            <div className="mt-5 text-left block">
              {headings.map(heading => (
                <p
                  key={heading.id}
                  className={`mb-4 ml-0 text-sm hover:text-substrateBlue dark:hover:text-substrateBlue-light ${
                    activeId === heading.id && 'text-substrateBlue dark:text-substrateBlue-light'
                  }`}
                >
                  <a href={`#${heading.id}`}>{heading.value}</a>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
