// import cx from 'classnames';
import { graphql } from 'gatsby';
import React from 'react';

import Layout from '../components/site/Layout';
import SEO from '../components/site/SEO';

export default function Home() {
  return (
    <Layout mode="full">
      <SEO title="Home" />
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
