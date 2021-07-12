import React from 'react'
import { graphql } from 'gatsby'
import { useIntl } from 'react-intl'
import Layout from '../components/Layout'
import TutorialCard from '../components/TutorialCard'

export default function tutorials({ data }: any) {
  const intl = useIntl()
  return (
    <Layout>
      <div className="px-4">
        <div className="text-2xl md:text-7xl my-8 font-bold text-center">
          {intl.formatMessage({ id: 'nav-tutorials' })}
        </div>
        <div className="container mb-40 flex flex-col items-center md:flex-row md:flex-wrap md:justify-center">
          <TutorialCard
            title={`Create Your First Substrate Chain`}
            image={data.tutorialOne}
            description={`Launch and interact with your first Substrate chain in this minimal end-to-end guide.`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/create-your-first-substrate-chain/`}
          />
          <TutorialCard
            title={`Proof of Existence`}
            image={data.tutorialOne}
            description={`In this tutorial, you will learn  ...`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/proof-of-existence/overview`}
          />
          <TutorialCard
            title={`Permissioned Network`}
            image={data.tutorialOne}
            description={`In this tutorial, you will learn  ...`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/permissioned-network/overview`}
          />
          <TutorialCard
            title={`Forkless Upgrades`}
            image={data.tutorialOne}
            description={`In this tutorial, you will learn  ...`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/forkless-upgrades/overview`}
          />
          <TutorialCard
            title={`Private Network`}
            image={data.tutorialOne}
            description={`In this tutorial, you will learn  ...`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/private-network/overview`}
          />
          <TutorialCard
            title={`Node Metrics`}
            image={data.tutorialOne}
            description={`In this tutorial, you will learn  ...`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/node-metrics/overview`}
          />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    tutorialOne: file(name: { eq: "tutorial-placeholder" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`
