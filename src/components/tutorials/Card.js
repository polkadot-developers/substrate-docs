import React from 'react';

import Icon from '../default/Icon';
import { Link } from '../default/Link';
//import { Image } from '../default/resolvers/Image';

const TutorialCard = ({ model }) => {
  const { frontmatter, fields } = model;
  const { title, description, featured_image, difficulty, time, relevantSkills } = frontmatter;
  const { path } = fields;
  // const imageData = getImage(featured_image)

  return (
    <Link to={path}>
      <article className="rounded overflow-hidden bg-substrateGray-light dark:bg-substrateDark">
        {featured_image ? (
          <div className="inline-block overflow-hidden w-full">
            <Image
              src={featured_image}
              className="w-full gatsby-image-wrapper gatsby-image-wrapper-constrained block h-24 md:h-60 xs:h-96 object-cover rounded-t transform transition-all duration-300 ease-in-out hover:scale-110"
            />
            {/* <img
              className="w-full gatsby-image-wrapper gatsby-image-wrapper-constrained block h-24 md:h-60 xs:h-96 object-cover rounded-t transform transition-all duration-300 ease-in-out hover:scale-110"
              src={featured_image}
              alt={title}
            /> */}
          </div>
        ) : (
          ''
        )}
        <div className="p-4">
          <h4 className="mb-4">{title}</h4>
          <p className="text-sm md:text-base">{description}</p>
          <div className="flex flex-row justify-between items-center">
            <div>
              {difficulty === 1 ? (
                <div className="flex justify-evenly">
                  <span className="text-sm uppercase tracking-wider">Beginner</span>
                  <div className="flex ml-1 mt-1">
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
                  </div>
                </div>
              ) : difficulty === 2 ? (
                <div className="flex justify-center content-center">
                  <span className="text-sm uppercase tracking-wider">Intermediate</span>
                  <div className="flex ml-1 mt-1">
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
                  </div>
                </div>
              ) : difficulty === 3 ? (
                <div className="flex justify-center content-center">
                  <span className="text-sm uppercase tracking-wider">Advanced</span>
                  <div className="flex ml-1 mt-1">
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                    <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex items-center">
              {time ? <Icon name="time" /> : ''} {time && time}
            </div>
          </div>
          <hr />
          <div className="h-full">
            {relevantSkills &&
              relevantSkills.map(i => {
                return (
                  <div
                    key={i}
                    className="inline-block m-2 px-4 p-2 text-sm rounded border border-substrateDark dark:border-substrateWhite"
                  >
                    {i}
                  </div>
                );
              })}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default TutorialCard;
