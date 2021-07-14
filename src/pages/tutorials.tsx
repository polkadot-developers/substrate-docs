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
            time={`< 1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/create-your-first-substrate-chain`}
          />
          <TutorialCard
            title={`Add Pallets to Your Runtime and Publish Custom Pallets`}
            image={data.tutorialOne}
            description={`Learn to add the Nicks pallet to your runtime and publish custom pallets that others can import into their runtimes.`}
            time={`2 Hours`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/add-a-pallet`}
          />
          <TutorialCard
            title={`Proof of Existence`}
            image={data.tutorialOne}
            description={`Build a customized Substrate chain with its own user interface.`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/proof-of-existence`}
          />
          <TutorialCard
            title={`Permissioned Network`}
            image={data.tutorialOne}
            description={`A comprehensive, end-to-end tutorial for building a permissioned network using node-authorization pallet.`}
            time={`2 Hours`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/permissioned-network`}
          />
          <TutorialCard
            title={`Forkless Upgrades`}
            image={data.tutorialOne}
            description={`Perform a forkless runtime upgrade on a running Substrate network.`}
            time={`2 Hours`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/forkless-upgrades`}
          />
          <TutorialCard
            title={`Private Network`}
            image={data.tutorialOne}
            description={`Learn to start a private blockchain network using an out-of-the-box Substrate node.`}
            time={`2 Hours`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/private-network`}
          />
          <TutorialCard
            title={`Node Metrics`}
            image={data.tutorialOne}
            description={`Learn how to visualize the metrics that Substrate records using Prometheus.`}
            time={`< 1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/v3/tutorials/node-metrics`}
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
