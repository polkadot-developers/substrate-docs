import React from 'react'
import { graphql } from 'gatsby'
import { useIntl } from 'react-intl'
import Layout from '../../components/Layout'
import TutorialCard from '../../components/TutorialCard'

export default function tutorials({ data }: any) {
  const intl = useIntl()
  return (
    <Layout>
      <div className="px-4">
        <h1 className="text-center my-8 lg:my-12">
          {intl.formatMessage({ id: 'nav-tutorials' })}
        </h1>
        <div className="mb-40 flex flex-col items-center md:flex-row md:flex-wrap md:justify-center">
          <TutorialCard
            title={`Create Your First Substrate Chain`}
            image={data.tutorialOne}
            description={`Launch and interact with your first Substrate chain in this minimal end-to-end guide.`}
            time={`< 1 Hour`}
            difficulty={1}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/create-your-first-substrate-chain`}
          />
          <TutorialCard
            title={`Add a FRAME Pallet to Your Runtime`}
            image={data.tutorialTwo}
            description={`Learn to add the Nicks pallet to runtime and publish a custom pallet that others can import.`}
            time={`2 Hours`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/add-a-pallet`}
          />
          <TutorialCard
            title={`Proof of Existence`}
            image={data.tutorialThree}
            description={`Build a customized Substrate chain with its own user interface.`}
            time={`1 Hour`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/proof-of-existence`}
          />
          <TutorialCard
            title={`Permissioned Network`}
            image={data.tutorialFour}
            description={`A comprehensive, end-to-end tutorial for building a permissioned network using node-authorization pallet.`}
            time={`1 Hour`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/permissioned-network`}
          />
          <TutorialCard
            title={`Forkless Upgrades`}
            image={data.tutorialFive}
            description={`Perform a forkless runtime upgrade on a running Substrate network.`}
            time={`2 Hours`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/forkless-upgrades`}
          />
          <TutorialCard
            title={`Private Network`}
            image={data.tutorialSix}
            description={`Learn how to start a private blockchain network using an out-of-the-box Substrate node.`}
            time={`2 Hours`}
            difficulty={1}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/private-network`}
          />
          <TutorialCard
            title={`Node Metrics`}
            image={data.tutorialOne}
            description={`Learn how to visualize the metrics that Substrate records using Prometheus.`}
            time={`< 1 Hour`}
            difficulty={1}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/node-metrics`}
          />
          <TutorialCard
            title={`Add the Contracts Pallet`}
            image={data.tutorialOne}
            description={`Allow your blockchain to support Wasm smart contracts by adding and configuring FRAME's Contracts pallet.`}
            time={`3 Hours`}
            difficulty={2}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/add-contracts`}
          />
          <TutorialCard
            title={`Cumulus Workshop`}
            image={data.tutorialOne}
            description={`A workshop to configure Substrate node as a Parachain`}
            time={`3 Hours`}
            difficulty={3}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/cumulus-workshop`}
          />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    tutorialOne: file(name: { eq: "tuts-one" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialTwo: file(name: { eq: "tuts-two" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialThree: file(name: { eq: "tuts-three" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialFour: file(name: { eq: "tuts-four" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialFive: file(name: { eq: "tuts-five" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialSix: file(name: { eq: "tuts-six" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`
