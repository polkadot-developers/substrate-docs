import React from 'react'
import { graphql } from 'gatsby'
import { useIntl } from 'react-intl'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import TutorialCard from '../../components/TutorialCard'

export default function tutorials({ data }: any) {
  const intl = useIntl()
  return (
    <Layout>
      <SEO title="Tutorials" />
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
            link={`/tutorials/v3/create-your-first-substrate-chain/`}
          />
          <TutorialCard
            title={`Add FRAME's Nicks Pallet to Your Runtime`}
            image={data.tutorialTwo}
            description={`Add the Nicks pallet to your runtime and publish a custom pallet that others can reuse in their projects.`}
            time={`2 Hours`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/add-a-pallet/`}
          />
          <TutorialCard
            title={`Proof of Existence`}
            image={data.tutorialThree}
            description={`Build a customized Substrate chain with its own user interface.`}
            time={`1 Hour`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/proof-of-existence/`}
          />
          <TutorialCard
            title={`Permissioned Network`}
            image={data.tutorialFour}
            description={`A comprehensive, end-to-end tutorial for building a permissioned network using node-authorization pallet.`}
            time={`1 Hour`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/permissioned-network/`}
          />
          <TutorialCard
            title={`Forkless Upgrades`}
            image={data.tutorialFive}
            description={`Perform a forkless runtime upgrade on a running Substrate network.`}
            time={`2 Hours`}
            difficulty={1}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/forkless-upgrades/`}
          />
          <TutorialCard
            title={`Start a Private Network`}
            image={data.tutorialSix}
            description={`Learn how to start a private blockchain network using an out-of-the-box Substrate node.`}
            time={`2 Hours`}
            difficulty={1}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/private-network/`}
          />
          <TutorialCard
            title={`Node Metrics`}
            image={data.tutorialThree}
            description={`Learn how to visualize the metrics that Substrate records using Prometheus.`}
            time={`< 1 Hour`}
            difficulty={1}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/node-metrics/`}
          />
          <TutorialCard
            title={`Develop Smart Contracts with ink!`}
            image={data.tutorialFour}
            description={`Learn to build and deploy an ERC20 token smart contract with ink!`}
            time={`2 Hours`}
            difficulty={2}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/ink-workshop/pt1/`}
          />
          <TutorialCard
            title={`Cumulus Workshop`}
            image={data.tutorialOne}
            description={`A workshop to configure a Substrate node as a Parachain`}
            time={`3 Hours`}
            difficulty={3}
            prerequisites={true}
            version={`V3.0.0`}
            link={`/tutorials/v3/cumulus-workshop/pt1/`}
          />
          <TutorialCard
            title={`Frontier Workshop`}
            image={data.tutorialSix}
            description={`A workshop to configure a Substrate node to run Substrate EVM and Solidity contracts`}
            time={`1 Hour`}
            difficulty={2}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/frontier/`}
          />
          <TutorialCard
            title={`Substrate Kitties Workshop`}
            image={data.tutorialSix}
            description={`Build a full stack application that handles the ownership management of Substrate Kitties.`}
            time={`4 Hours`}
            difficulty={2}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/kitties/pt1/`}
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
