// import cx from 'classnames';
import { graphql } from 'gatsby';
import React from 'react';

import { Link } from '../components/default/Link';
import Section from '../components/layout/Section';
import Layout from '../components/site/Layout';
import SEO from '../components/site/SEO';

export default function Home() {
  return (
    <Layout mode="full">
      <SEO title="Home" />
      <Section>
        <h1 className="mt-20 text-5xl lg:text-6xl font-extrabold mb-6">Docs</h1>
        <h2 className="text-xl xl:text-3xl font-semibold text-substrateBlue">
          <Link to="/quick-start/">{'→'} Quick start</Link>
        </h2>
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
  }
`;
