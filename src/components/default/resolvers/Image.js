import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React from 'react';

import { useImage } from '../../../hooks/use-image';
import { testExternalLink } from '../../default/Link';

function ImageResolver({ src: path }) {
  if (testExternalLink(path)) {
    return <img data-src={path} alt="" className="lazyload" />;
  } else if (useImage(path)) {
    const { image } = useImage(path);
    const imageData = getImage(image.childImageSharp.gatsbyImageData);
    return <>{imageData && <GatsbyImage image={imageData} alt="" />}</>;
  } else return `<Image is missing>`;
}

export { ImageResolver as Image };
