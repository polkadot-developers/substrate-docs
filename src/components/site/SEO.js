import React from 'react';
import { Helmet } from 'react-helmet';

import { useSiteMetadata } from '../../hooks/use-site-metadata';

export default function SEO({ children = null, description, lang = 'en', meta = [], title, excerpt }) {
  const { siteMetadata } = useSiteMetadata();

  const metaDescription = description || excerpt || siteMetadata.description;
  const metaTitle = siteMetadata.title_meta;
  const defaultTitle = title + ' | ' + siteMetadata.title || siteMetadata.title_meta;
  const image = siteMetadata.image_og;
  const siteUrl = siteMetadata.siteUrl;
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${siteMetadata.title}` : `%s`}
      meta={[
        {
          name: `og:url`,
          content: siteUrl,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: defaultTitle || metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: image,
        },
        {
          name: `twitter:domain`,
          content: siteUrl,
        },
        {
          name: `twitter:url`,
          content: siteUrl,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:title`,
          content: defaultTitle || metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: 'twitter:image',
          content: image,
        },
      ].concat(meta)}
    >
      {children}
    </Helmet>
  );
}
