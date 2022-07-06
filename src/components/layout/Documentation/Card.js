import cx from 'classnames';
import React from 'react';

import Icon from '../../default/Icon';
import CardLink from './CardLink';

export default function Card({
  title,
  text,
  icon,
  bodyLinkOneURL,
  bodyLinkOneTitle,
  bodyLinkTwoURL,
  bodyLinkTwoTitle,
  bodyLinkThreeURL,
  bodyLinkThreeTitle,
}) {
  return (
    <div
      className={cx(
        'bg-substrateGray rounded-md mb-4 lg:mx-4 lg:mb-8 md:md-10 shadow-xl md:w-full lg:w-[280px] xl:w-[350px]',
        'dark:bg-substrateBlackish'
      )}
    >
      <div className="p-6 lg:p-9 xs:text-center sm:text-left">
        <Icon name={icon} className="h-10 w-10 block fill-current mb-6 xs:mx-auto sm:mx-0" />
        <p className="text-2xl lg:text-4xl font-bold capitalize">{title}</p>
        <p className="sm:h-24 block">{text}</p>
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
