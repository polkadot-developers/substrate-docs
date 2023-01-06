import { graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { Layout, PrimaryButtonLink, Section, SEO } from 'gatsby-plugin-substrate';
import React from 'react';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Layout showFooterNewsletter={false}>
      <SEO title={t('404.title')} />
      <Section>
        <div className="w-2/3 mx-auto mt-20 text-center self-center">
          <h1 className="mb-10 four-oh-four-title text-9xl xl:text-four-oh-four font-body">{t('404.title')}</h1>
          <h2 className="w-1/2 text-2xl mb-10 mx-auto">
            Sorry! This content is unavailable.{' '}
            <a
              href="https://github.com/substrate-developer-hub/substrate-docs/issues/new?title=Broken%20Link&template=broken-link.yaml&labels=Broken%20Link"
              className="text-substrateBlue dark:text-substrateBlue-light mdx-anchor underline hover:opacity-90"
            >
              Report a broken link
            </a>{' '}
            or learn more about{' '}
            <a
              href="https://github.com/substrate-developer-hub/substrate-docs/issues/1132"
              className="text-substrateBlue dark:text-substrateBlue-light mdx-anchor underline hover:opacity-90"
            >
              documentation updates
            </a>
            .
          </h2>
          <PrimaryButtonLink link="/">Go to the homepage</PrimaryButtonLink>
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
