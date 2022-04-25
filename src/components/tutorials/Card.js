import React from 'react';

import { Link } from '../default/Link';
//import { Image } from '../default/resolvers/Image';

const TutorialCard = ({ model }) => {
  const { frontmatter, fields } = model;
  const { title, description, featured_image } = frontmatter;
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
          </div>
        </article>
      </Link>
    </article>
  );
};

export default TutorialCard;
