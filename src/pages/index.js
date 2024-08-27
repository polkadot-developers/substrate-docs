import { graphql } from 'gatsby';
import { Layout, Section, SEO } from 'gatsby-plugin-substrate';
import React from 'react';

import Card from '../components/layout/Documentation/Card';
// import CardsList from '../components/layout/Documentation/CardList';
// import SearchDocumentation from '../components/ui/SearchDocumentation';

export default function Home({ data }) {
  // eslint-disable-next-line no-empty-pattern
  const {} = data;
  return (
    <Layout showFooterNewsletter={false} mode="full">
      <SEO title="Home" />
      <Section className="text-center mt-12 intro">
        <h1 className="mb-8 text-4xl lg:text-6xl md:text-6xl font-title font-extrabold substrate">Substrate</h1>
        <p>Is now part of </p>
        <h1
          className="
          mb-8 text-4xl
          lg:text-6xl
          md:text-6xl
          font-title
          font-extrabold
          polkadot-sdk
          underline-effect"
        >
          Polkadot SDK
        </h1>
      </Section>
      <Section className="flex justify-center">
        <Card
          title="Polkadot SDK"
          text="Polkadot SDK is now the overarching name for Substrate, and the rest of Polkadot's Development Kit"
          featured_image="/media/images/homepage/hands-on.png"
          link="/polkadot-sdk"
          bodyLinkOneURL="https://github.com/polkadot-developers/"
          bodyLinkOneTitle="Polkadot Developers"
          bodyLinkTwoURL="https://paritytech.github.io/polkadot-sdk/master/polkadot_sdk_docs/index.html"
          bodyLinkTwoTitle="Polkadot SDK Docs"
          bodyLinkThreeURL="https://papermoonio.github.io/polkadot-ecosystem-docs-draft/"
          bodyLinkThreeTitle="Polkadot Ecosystem Documentation"
        />
      </Section>
    </Layout>
  );
}

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    goodbye: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "/homepage/goodbye.md$/" } }) {
      edges {
        node {
          id
          frontmatter {
            title
            link
            order
            description
            bodyLinkOneURL
            bodyLinkOneTitle
            bodyLinkTwoURL
            bodyLinkTwoTitle
            bodyLinkThreeURL
            bodyLinkThreeTitle
            featured_image
          }
        }
      }
    }
    content: allMarkdownRemark(filter: { fileAbsolutePath: { regex: "//(homepage)/" } }) {
      edges {
        node {
          id
          frontmatter {
            title
            link
            order
            description
            bodyLinkOneURL
            bodyLinkOneTitle
            bodyLinkTwoURL
            bodyLinkTwoTitle
            bodyLinkThreeURL
            bodyLinkThreeTitle
            featured_image
          }
        }
      }
    }
  }
`;
