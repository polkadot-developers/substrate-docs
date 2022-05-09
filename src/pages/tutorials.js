import { graphql } from 'gatsby';
import React from 'react';

import Sidebar from '../components/layout/Sidebar';
import Layout from '../components/site/Layout';
import NavSidebar from '../components/site/NavSidebar';
import SEO from '../components/site/SEO';
import TutorialList from '../components/tutorials/List';
import { useTutorials } from '../hooks/use-tutorials';

export default function TutorialsPage() {
  const { tutorials } = useTutorials();
  return (
    <Layout>
      <SEO title="Tutorials" />
      <div className="flex flex-col lg:flex-row">
        <Sidebar currentPath="/tutorials/">
          <NavSidebar currentPath="/tutorials/" />
        </Sidebar>

        <div className="px-4">
          <h1 className="text-center my-8 lg:my-12">Tutorials</h1>
          <div className="mb-40">
            <TutorialList models={tutorials} />
          </div>
        </div>
      </div>
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
