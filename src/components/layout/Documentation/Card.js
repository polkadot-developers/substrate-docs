import cx from 'classnames';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React from 'react';

import analytics from '../../../analytics';
import snakecase from '../../../hooks/snakecase';
import { Link } from '../../default/Link';
import CardLink from './CardLink';

export default function Card({
  title,
  text,
  image,
  link,
  bodyLinkOneURL,
  bodyLinkOneTitle,
  bodyLinkTwoURL,
  bodyLinkTwoTitle,
  bodyLinkThreeURL,
  bodyLinkThreeTitle,
}) {
  const imageStyles = 'block h-28 sm:h-40 xs:h-40 object-cover rounded-t-md';
  const cardImage = getImage(image);
  return (
    <div
      className={cx(
        'bg-substrateGray-light rounded-md shadow-md mb-8',
        'xl:w-[350px]',
        'lg:w-[280px] lg:mx-4',
        'md:mb-10',
        'sm:mb-20',
        'xs:w-full',
        'dark:bg-substrateBlackish',
        'hover:scale-105 transition-transform'
      )}
    >
      <Link
        to={link}
        onClick={() => {
          analytics.click(snakecase(link));
        }}
      >
        <GatsbyImage className={imageStyles} image={cardImage} alt={`Substrate Documentation ${title}`} />
      </Link>
      <div className="lg:p-6 md:p-10 sm:p-6 xs:p-6">
        <p className="text-2xl lg:text-3xl xl:text-4xl capitalize font-title font-extrabold">{title}</p>
        <p className="xl:h-32 lg:h-44 md:h-12 sm:h-22 block">{text}</p>
        <div className="block sm:text-left">
          <CardLink className="mdx-anchor text-substrateGreen block my-2" link={bodyLinkOneURL}>
            {bodyLinkOneTitle}
          </CardLink>
          <CardLink className="mdx-anchor text-substrateGreen block my-2" link={bodyLinkTwoURL}>
            {bodyLinkTwoTitle}
          </CardLink>
          <CardLink className="mdx-anchor text-substrateGreen block my-2" link={bodyLinkThreeURL}>
            {bodyLinkThreeTitle}
          </CardLink>
        </div>
      </div>
    </div>
  );
}
