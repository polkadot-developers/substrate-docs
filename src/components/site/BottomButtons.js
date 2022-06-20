import React from 'react';

import configNav from '../../../content/config/nav.yaml';
//import NextButton from './NextButton';
//import PreviousButton from './PreviousButton';

const BottomButtons = () => {
  //const { menu } = configNav;
  //const docs = configNav.docs.pages;
  // const [nextButton, setNextButton] = useState(menu, pagePath);
  // const [prevButton, setPrevButton] = useState(menu, pagePath);

  const flatten = (obj, path = '') => {
    if (!(obj instanceof Object)) return { [path.replace(/\.$/g, '')]: obj };

    return Object.keys(obj).reduce((output, key) => {
      return obj instanceof Array
        ? { ...output, ...flatten(obj[key], path + '[' + key + '].') }
        : { ...output, ...flatten(obj[key], path + key + '.') };
    }, {});
  };

  //const FlatNav = flatten(configNav);
  //console.log(FlatNav);

  //const pages = [menu, docs, pagePath];

  // useEffect(() => {
  //   const pages = [];
  //   console.log(menu);
  //   menu.forEach(menuItems => {
  //     console.log(menuItems);
  //     menuItems.items.forEach(item => {
  //       if (!item.link.includes('#')) {
  //         pages.push(item);
  //       }
  //     });
  //   });
  //   pages.map((cur, index) => {
  //     if (cur.link === `${pagePath}/`) {
  //       if (index === 0) {
  //         setNextButton(pages[index + 1]);
  //         setPrevButton(null);
  //       } else if (index === pages.length - 1) {
  //         setPrevButton(pages[index - 1]);
  //         setNextButton(null);
  //       } else {
  //         setNextButton(pages[index + 1]);
  //         setPrevButton(pages[index - 1]);
  //       }
  //     }
  //   });
  // }, []);

  // console.log(pagePath + menu);
  // console.log(configNav);
  // console.log(docs + pages);
  // console.log(nextButton + ' ' + setNextButton);
  // console.log(prevButton + ' ' + setPrevButton);
  return (
    <div
    // className={`flex flex-col items-center lg:flex-row ${
    //   prevButton === null ? 'lg:justify-end' : 'lg:justify-between'
    // }`}
    >
      <span>no</span>
    </div>
  );
};

export default BottomButtons;
