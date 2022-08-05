import React from 'react';

import { Icon } from './Icon';
import { Link } from './Link';

const CommunityCard = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <div key={index} data-aos="fade-up" data-aos-delay={index === 1 ? '200' : index === 2 ? '400' : ''}>
          <div className="cursor-pointer shadow-xl px-6 py-8 transition-transform rounded-md bg-white dark:bg-substrateDark mdx-anchor relative min-h-full hover:scale-105">
            <div className="text-2xl font-bold mb-5">{item.title}</div>
            <p className="h-[72px]">{item.description}</p>
            <hr />
            <p>
              <b>{item.headingOne}:</b>
            </p>
            <div className="flex items-center mb-6 font-bold">
              <Icon name={item.iconOne} className="mr-3 fill-current dark:text-subtrateWhite" />
              <Link to={item.linkOne}>{item.linkTextOne}</Link>
            </div>
            <hr />
            <p>
              <b>{item.headingTwo}:</b>
            </p>
            <div className="flex items-center mb-6 font-bold">
              <Icon name={item.iconTwo} className="mr-3 fill-current dark:text-subtrateWhite" />
              <Link to={item.linkTwo}>{item.linkTextTwo}</Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export { CommunityCard };
