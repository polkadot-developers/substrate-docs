import { useEffect, useState } from 'react';

export default function useActiveId(itemIds) {
  const [activeId, setActiveId] = useState(``);

  useEffect(() => {
    const observer = new IntersectionObserver(
      headings => {
        headings.forEach(heading => {
          if (heading.isIntersecting) {
            setActiveId(heading.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` }
    );

    itemIds.forEach(id => {
      if (observer.type === Element) {
        observer.observe(document.getElementById(id));
      }
    });

    return () => {
      itemIds.forEach(id => {
        if (document.getElementById(id)) {
          observer.unobserve(document.getElementById(id));
        }
      });
    };
  }, [itemIds]);

  return activeId;
}
