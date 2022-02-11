import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import TutorialCard from '../../components/TutorialCard'

export default function tutorials({ data }: any) {
  return (
    <Layout>
      <SEO title="Tutorials" />
      <div className="px-4">
        <h1 className="text-center my-8 lg:my-12">Tutorials</h1>
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
            title={`Add the Nicks Pallet to your Runtime`}
            image={data.tutorialTwo}
            description={`Add the Nicks pallet to your runtime and publish a custom pallet that others can reuse in their projects.`}
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
            title={`Substrate Kitties Workshop`}
            image={data.tutorialEleven}
            description={`Build a full stack application that handles the ownership management of Substrate Kitties.`}
            time={`4 Hours`}
            difficulty={2}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/kitties/pt1`}
          />
          <TutorialCard
            title={`Start a Private Network`}
            image={data.tutorialSix}
            description={`Learn how to start a private blockchain network using an out-of-the-box Substrate node.`}
            time={`2 Hours`}
            difficulty={1}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/private-network`}
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
            title={`Node Metrics`}
            image={data.tutorialSeven}
            description={`Learn how to visualize the metrics that Substrate records using Prometheus.`}
            time={`< 1 Hour`}
            difficulty={1}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/node-metrics`}
          />
          <TutorialCard
            title={`Develop Smart Contracts with ink!`}
            image={data.tutorialEight}
            description={`Learn to build and deploy an ERC20 token smart contract with ink!`}
            time={`2 Hours`}
            difficulty={2}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/ink-workshop/pt1`}
          />
          <TutorialCard
            title={`Frontier Workshop`}
            image={data.tutorialTen}
            description={`A workshop to configure a Substrate node to run Substrate EVM and Solidity contracts`}
            time={`1 Hour`}
            difficulty={2}
            prerequisites={false}
            version={`V3.0.0`}
            link={`/tutorials/v3/frontier`}
          />
          <TutorialCard
            title={`Create a Parachain with Cumulus`}
            image={data.tutorialNine}
            description={`Learn to use the parachain template in local testnet`}
            time={`3 Hours`}
            difficulty={3}
            prerequisites={true}
            version={`polkadot-v0.9.16`}
            link={`/tutorials/v3/cumulus/start-relay`}
          />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    tutorialOne: file(name: { eq: "tuts-1" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialTwo: file(name: { eq: "tuts-2" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialThree: file(name: { eq: "tuts-3" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialFour: file(name: { eq: "tuts-4" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialFive: file(name: { eq: "tuts-5" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialSix: file(name: { eq: "tuts-6" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialSeven: file(name: { eq: "tuts-7" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialEight: file(name: { eq: "tuts-8" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialNine: file(name: { eq: "tuts-9" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialTen: file(name: { eq: "tuts-10" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialEleven: file(name: { eq: "tuts-11" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialTwelve: file(name: { eq: "tuts-12" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
    tutorialThirteen: file(name: { eq: "tuts-13" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`
