import { graphql } from 'gatsby';
import { Layout, Section, SEO } from 'gatsby-plugin-substrate';
import React from 'react';

import CardsList from '../components/layout/Documentation/CardList';
import SearchDocumentation from '../components/ui/SearchDocumentation';

export default function Home({ data }) {
  const { content } = data;
  return (
    <Layout showFooterNewsletter={false} mode="full">
      <SEO title="Home" />
      <Section className="text-center mt-12">
        <h1 className="mb-8 text-4xl lg:text-6xl md:text-6xl font-title font-extrabold">Substrate Documentation</h1>
        <div className="sm:max-w-lg mx-auto mb-10">
          <p className="max-w-lg text-xl">
            Substrate documentation includes conceptual, procedural, and reference information for blockchain builders
            and parachain project teams.
          </p>
        </div>
        <SearchDocumentation />
      </Section>
      <Section className="flex justify-center">
        <CardsList data={content.edges} />
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
