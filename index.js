// import cx from 'classnames';
import { graphql } from 'gatsby';
import React from 'react';
import Lottie from 'react-lottie';

import Banner from '..//components/site/Banner';
import Section from '../components/layout/Section';
import Layout from '../components/site/Layout';
import SEO from '../components/site/SEO';
import PrimaryFixedButton from '../components/ui/PrimaryFixedButton';
import * as animationData from '../images/animations/dev-hero.json';

export default function Home() {
  return (
    <Layout mode="full">
      <Banner />
      <SEO title="Home" />
      <Section styles="mt-12">
        <div className="flex flex-col md:flex-row md:items-center doc-hero">
          <div className="md:w-1/2 mb-10 lg:m-0">
            <div className="text-5xl lg:text-6xl font-extrabold mb-6">
              Substrate <br /> Documentation
            </div>
            <PrimaryFixedButton hero link="/quick-start/">
              Get Started
            </PrimaryFixedButton>
          </div>
          <div className="flex justify-center md:w-1/2">
            <div className="lg:h-[430px] lg:w-[430px] lg:mt-8">
              <Lottie
                options={{
                  animationData,
                  loop: false,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice',
                  },
                }}
                isClickToPauseDisabled={true}
              />
            </div>
          </div>
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
