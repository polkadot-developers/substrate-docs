// import cx from 'classnames';
import { graphql } from 'gatsby';
import React from 'react';

import CardsList from '../components/layout/documentation/CardList';
import Section from '../components/layout/Section';
import Layout from '../components/site/Layout';
import SEO from '../components/site/SEO';
import PrimaryFixedButton from '../components/ui/PrimaryFixedButton';
import SearchDocumentation from '../components/ui/SearchDocumentation';

export default function Home({ data }) {
  const { content } = data;
  return (
    <Layout mode="full">
      <SEO title="Home" />
      <Section className="text-center mt-12">
        <h1 className="mb-8 text-4xl lg:text-6xl md:text-6xl font-title font-extrabold">
          substrate<span className="text-substrateGreen relative -top-3">_</span> documentation
        </h1>
        <div className="sm:max-w-lg mx-auto mb-10">
          <p className="max-w-lg text-xl">
            Where blockchain innovators discover & share reusable pallets for use with Parity Substrate, the open-source
            blockchain framework.
          </p>
        </div>
        <PrimaryFixedButton
          link="/quick-start/"
          className="inline-flex items-center relative rounded-md px-8 py-4 text-xl"
        >
          Quick start
        </PrimaryFixedButton>
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
            order
            description
            bodyLinkOneURL
            bodyLinkOneTitle
            bodyLinkTwoURL
            bodyLinkTwoTitle
            bodyLinkThreeURL
            bodyLinkThreeTitle
            icon
            image {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  }
`;
