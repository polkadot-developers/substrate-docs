import React from 'react';
import { Helmet } from 'react-helmet';

import { useSiteMetadata } from '../../hooks/use-site-metadata';

export default function SEO({ children = null, description = '', lang = 'en', meta = [], title }) {
  const { siteMetadata } = useSiteMetadata();

  const metaDescription = description || siteMetadata.description || '';
  const defaultTitle = siteMetadata.title;
  const titleMeta = siteMetadata.title_meta;
  const image = siteMetadata.image_og;
  const siteUrl = siteMetadata.siteUrl;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : `%s`}
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
          content: titleMeta,
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
          content: titleMeta,
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
