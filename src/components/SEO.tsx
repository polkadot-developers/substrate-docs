import React, { ReactChildren } from 'react'
import { Helmet } from 'react-helmet'
import { useSiteMetadata } from '../components/Hooks/use-site-metadata'

interface SEOProps {
  description?: string
  title?: string
  children?: ReactChildren
}

const SEO = ({ description, title, children }: SEOProps) => {
  const { siteMetadata } = useSiteMetadata()

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    publisher: {
      '@type': 'Organization',
      name: 'Blockchain Infrastructure for the Decentralised Web',
      url: 'https://www.parity.io/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.parity.io/images/parity-logo-square.png',
        width: 60,
        height: 60,
      },
    },
    url: 'https://docs.substrate.io/',
    image: {
      '@type': 'ImageObject',
      url: `${siteMetadata.iamge_og}`,
      width: 1600,
      height: 800,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.parity.io/',
    },
    description:
      'Substrate enables developers to quickly and easily build future-proof blockchains optimized for any use case.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ignition Law, 1 Sans Walk',
      addressLocality: 'London',
      postalCode: 'EC1R 0LT',
      addressCountry: 'UK',
    },
    sameAs: [
      `${siteMetadata.twitter}`,
      `${siteMetadata.linkedIn}`,
      `${siteMetadata.github}`,
      `${siteMetadata.stackOverflow}`,
    ],
  }

  const metaDescription = description || siteMetadata.description
  const defaultTitle = siteMetadata.title
  const titleMeta = siteMetadata.title
  const image = siteMetadata.image_og
  const siteUrl = siteMetadata.siteUrl
  const metaKeywords = siteMetadata.keywords

  return (
    <Helmet
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
      ].concat(
        metaKeywords && metaKeywords.length > 0
          ? {
              name: `keywords`,
              content: metaKeywords.join(`, `),
            }
          : []
      )}
    >
      {children}
      <script type="application/ld+json">{JSON.stringify(websiteData)}</script>
    </Helmet>
  )
}

export default SEO
