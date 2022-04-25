import React from 'react';

import { Link } from '../default/Link';
//import { Image } from '../default/resolvers/Image';

const TutorialCard = ({ model }) => {
  const { frontmatter, fields } = model;
  const { title, description, featured_image, difficulty, time } = frontmatter;
  const { path } = fields;
  // const imageData = getImage(featured_image)

  return (
    <article>
      <Link to={path}>
        <article className="rounded overflow-hidden bg-substrateGray-light dark:bg-substrateDark">
          {featured_image ? (
            <div className="inline-block overflow-hidden">
              <img
                className="gatsby-image-wrapper gatsby-image-wrapper-constrained block h-24 md:h-60 object-cover rounded-t transform transition-all duration-300 ease-in-out hover:scale-110"
                src={featured_image}
                alt={title}
              />
            </div>
          ) : (
            ''
          )}
          <div className="p-4">
            <h4 className="mb-4">{title}</h4>
            <p className="text-sm md:text-base">{description}</p>
            <div className="flex flex-col md:flex-row md:justify-between items-center">
              <div>
                {difficulty === 1 ? (
                  <div className="flex justify-center content-center">
                    <span className="text-sm uppercase tracking-widest">Beginner</span>
                    <div className="flex ml-4 mt-1">
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
                    </div>
                  </div>
                ) : difficulty === 2 ? (
                  <div className="flex justify-center content-center">
                    <span className="text-sm uppercase tracking-widest">Intermediate</span>
                    <div className="flex ml-4 mt-1">
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark bg-opacity-10 dark:bg-substrateGray dark:bg-opacity-50 rounded-full"></span>
                    </div>
                  </div>
                ) : difficulty === 3 ? (
                  <div className="flex justify-center content-center">
                    <span className="text-sm uppercase tracking-widest">Advanced</span>
                    <div className="flex ml-4 mt-1">
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                      <span className="mx-1 inline-block w-3 h-3 bg-substrateDark dark:bg-substrateGray rounded-full"></span>
                    </div>
                  </div>
                ) : null}
              </div>
              <div>
                <svg
                  className="inline-block -mt-0.5 fill-current text-black dark:text-white"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.02622 0C10.8539 0 14 3.14607 14 7.02622C14 10.8539 10.8539 14 7.02622 14C3.14607 14 0 10.8539 0 7.02622C0 3.14607 3.14607 0 7.02622 0ZM6.29213 3.1985C6.29213 2.51685 7.34082 2.51685 7.34082 3.1985V6.92135L9.75281 7.603C10.382 7.81273 10.1199 8.80899 9.4382 8.65168L6.71161 7.81273C6.44944 7.7603 6.29213 7.55056 6.29213 7.28839V3.1985ZM7.02622 1.04869C3.72285 1.04869 1.04869 3.72285 1.04869 7.02622C1.04869 10.2772 3.72285 12.9513 7.02622 12.9513C10.2772 12.9513 12.9513 10.2772 12.9513 7.02622C12.9513 3.72285 10.2772 1.04869 7.02622 1.04869Z" />
                </svg>{' '}
                {time && time}
              </div>
            </div>
            <hr />
          </div>
        </article>
      </Link>
    </article>
  );
};

export default TutorialCard;
