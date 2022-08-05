import { useEffect, useState } from 'react';

const useHeadingsData = () => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const main = document.querySelector('main');
    const headingElements = Array.from(main.querySelectorAll('h2, h3'));

    const headingTitles = [];

    headingElements.forEach(heading => {
      const { innerText: title, id } = heading;
      headingTitles.push({ title, id });
    });

    setHeadings(headingTitles);
  }, []);

  return headings;
};

export { useHeadingsData };
