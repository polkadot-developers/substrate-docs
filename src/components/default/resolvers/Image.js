import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import React from 'react';

import { useImage } from '../../../hooks/use-image';
import { testExternalLink } from '../../default/Link';

function ImageResolver({ src: path, ...others }) {
  if (testExternalLink(path)) {
    return <img data-src={path} className="lazyload" {...others} />;
  } else if (useImage(path)) {
    const { image } = useImage(path);
    const imageData = getImage(image.childImageSharp.gatsbyImageData);
    return <>{imageData && <GatsbyImage image={imageData} {...others} />}</>;
  } else return `<Image is missing>`;
}

export { ImageResolver as Image };
