import { useEffect, useState } from 'react';

export const useActiveHash = items => {
  const [activeHash, setActiveHash] = useState(``);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveHash(entry.target.id);
        }
      });
    });
    items.forEach(id => {
      const el = document.getElementById(id);
      el
        ? observer.observe(document.getElementById(id))
        : console.warn(`Unknown ID: ${id}. We don't support h1 tag (#) in markdown article.`);
    });
  }, []);
  return activeHash;
};
