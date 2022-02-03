import { graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import Section from '../components/layout/Section';
import Layout from '../components/site/Layout';
import SEO from '../components/site/SEO';
import PrimaryButtonLink from '../components/ui/PrimaryButtonLink';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Layout>
      <SEO title={t('404.title')} />
      <Section>
        <div className="w-2/3 mx-auto mt-20 text-center self-center">
          <h1 className="mb-10 four-oh-four-title text-9xl xl:text-four-oh-four font-body">{t('404.title')}</h1>
          <h2 className="text-4xl mb-10 font-bold">{t('404.message')}</h2>
          <PrimaryButtonLink link="/">Home</PrimaryButtonLink>
        </div>
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
