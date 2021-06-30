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
            title={`Build a PoE Decentralized Application`}
            image={data.tutorialOne}
            description={`Build a customized Substrate chain with it's own user interface`}
            time={`1 Hour`}
            difficulty={`intermediate`}
            prerequisites={false}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Create Your First Substrate Chain`}
            image={data.tutorialOne}
            description={`Launch and interact with your first Substrate chain in this minimal end-to-end guide.`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Build a Permissioned Network`}
            image={data.tutorialOne}
            description={`A comprehensive, end-to-end tutorial for building a permissioned network using node-authorization pallet.`}
            time={`4 Hour`}
            difficulty={`advance`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Build a Permissioned Network`}
            image={data.tutorialOne}
            description={`A comprehensive, end-to-end tutorial for building a permissioned network using node-authorization pallet.`}
            time={`4 Hour`}
            difficulty={`advance`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Create Your First Substrate Chain`}
            image={data.tutorialOne}
            description={`Launch and interact with your first Substrate chain in this minimal end-to-end guide.`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Visualize Node Metrics`}
            image={data.tutorialOne}
            description={`Launch and interact with your first Substrate chain in this minimal end-to-end guide.`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Visualize Node Metrics`}
            image={data.tutorialOne}
            description={`Launch and interact with your first Substrate chain in this minimal end-to-end guide.`}
            time={`1 Hour`}
            difficulty={`beginner`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Add The Contracts Pallet To A Runtime`}
            image={data.tutorialOne}
            description={`A comprehensive, end-to-end tutorial for building a permissioned network using node-authorization pallet.`}
            time={`4 Hour`}
            difficulty={`advance`}
            prerequisites={true}
            version={`V3.0.0`}
            link={`#`}
          />
          <TutorialCard
            title={`Build a PoE Decentralized Application`}
            image={data.tutorialOne}
            description={`Build a customized Substrate chain with it's own user interface`}
            time={`1 Hour`}
            difficulty={`intermediate`}
            prerequisites={false}
            version={`V3.0.0`}
            link={`#`}
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
