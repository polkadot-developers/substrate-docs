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
      <div className="w-60 sticky top-20 max-h-[calc(100vh)] pb-32 ml-11 overflow-y-auto overscroll-contain">
        {data && (
          <div className="mb-5 font-semibold pt-9 table-of-contents">
            <div className="mb-5">ON THIS PAGE</div>
            <ul className="mt-5 list-disc list-outside">
              {headings.map(heading => (
                <li
                  key={heading.id}
                  className={`mb-2 ml-5 hover:text-substrateBlue dark:hover:text-substrateBlue-light ${
                    activeId === heading.id && 'text-substrateBlue dark:text-substrateBlue-light'
                  }`}
                >
                  <a href={`#${heading.id}`}>{heading.value}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
