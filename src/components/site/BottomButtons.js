import React from 'react';

import configNav from '../../../content/config/nav.yaml';
//import NextButton from './NextButton';
//import PreviousButton from './PreviousButton';

const BottomButtons = ({ pageSlug }) => {
  //const [nextButton /*setNextButton*/] = useState();
  //const [prevButton /*setPrevButton*/] = useState();
  const pages = [];
  //console.log(pageSlug);
  //console.log(configNav);
  //console.log(configNav);
  //const { menu } = configNav;
  configNav.docs.pages.map(item => {
    pages.push(item.url);
  });
  configNav.tutorials.pages.map(item => {
    pages.push(item.url);
  });
  configNav.reference.pages.map(item => {
    pages.push(item.url);
  });
  //const reptiles = ['alligator', 'snake', 'lizard'];
  //console.log(pages);
  return (
    <div className="my-5">
      <div>{pages[0]}</div>
      {console.log(pages + pageSlug)}
      {pages.map(page => {
        return <div key={page}>{page === pageSlug ? page : ''}</div>;
      })}
    </div>
  );
};

export default BottomButtons;
