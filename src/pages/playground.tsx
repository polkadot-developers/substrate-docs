import React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { useIntl } from 'react-intl'
import Layout from '../components/Layout'
import { SecondaryButton } from '../components/Buttons'
import PlaygroundCard from '../components/PlaygroundCard'
import iconOne from '../images/box-icon.svg'
import iconTwo from '../images/lightening-icon.svg'
import iconThree from '../images/squiqqly-lines.svg'

export default function playground({ data }: any) {
  const intl = useIntl()
  const image = getImage(data.playgroundSnapshot)
  return (
    <Layout>
      <section className="container px-4 py-20 text-center">
        <div className="text-2xl md:text-6xl mb-8 font-bold text-center">
          {intl.formatMessage({ id: 'playground-title' })}
        </div>
        <p className="font-medium max-w-4xl mx-auto">
          {intl.formatMessage({ id: 'playground-description' })}
        </p>
        <p className="font-medium text-substrateBlue">
          {intl.formatMessage({ id: 'playground-github-info' })}
        </p>
        <SecondaryButton external={true} link={`https://www.github.com`}>
          {intl.formatMessage({ id: 'playground-github-cta' })}
        </SecondaryButton>
      </section>
      <section className="container px-4 mb-28">
        <div className="text-xl md:text-4xl my-8 font-bold text-center">
          {intl.formatMessage({ id: 'playground-configuration-title' })}
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-center items-center">
          <PlaygroundCard
            icon={iconOne}
            difficulty={'beginner'}
            title={`${intl.formatMessage({ id: 'playground-card-one-title' })}`}
            description={`${intl.formatMessage({
              id: 'playground-card-one-description',
            })}`}
            playgroundLink={`/#`}
            tutData={[
              {
                name: 'Create a substrate blockchain',
                link: '/#',
              },
              {
                name: 'Create flexible runtime library',
                link: '/#',
              },
              {
                name: 'Configure Runtime',
                link: '/#',
              },
            ]}
          />
          <PlaygroundCard
            icon={iconTwo}
            difficulty={'intermediate'}
            title={`${intl.formatMessage({ id: 'playground-card-two-title' })}`}
            description={`${intl.formatMessage({
              id: 'playground-card-one-description',
            })}`}
            playgroundLink={`/#`}
            tutData={[
              {
                name: 'Create a substrate blockchain',
                link: '/#',
              },
              {
                name: 'Create flexible runtime library',
                link: '/#',
              },
            ]}
          />
          <PlaygroundCard
            icon={iconThree}
            difficulty={'advance'}
            title={`${intl.formatMessage({
              id: 'playground-card-three-title',
            })}`}
            description={`${intl.formatMessage({
              id: 'playground-card-one-description',
            })}`}
            playgroundLink={`/#`}
            tutData={[
              {
                name: 'Create a substrate blockchain',
                link: '/#',
              },
              {
                name: 'Create flexible runtime library',
                link: '/#',
              },
            ]}
          />
        </div>
      </section>
      <section className="container px-4  mb-28">
        <div className="flex flex-col md:flex-row items-center">
          <GatsbyImage
            className="mx-auto md:w-1/2"
            image={image}
            alt="Substrate Playground Screenshot"
          />
          <div className="md:w-1/2 md:pl-20">
            <div className="text-xl md:text-4xl my-8 font-bold text-center md:text-left">
              {intl.formatMessage({ id: 'playground-substrate-playground' })}
            </div>
            <p>
              {intl.formatMessage({ id: 'playground-substrate-paragraph-one' })}
            </p>
            <p>
              {intl.formatMessage({ id: 'playground-substrate-paragraph-two' })}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
export const pageQuery = graphql`
  {
    playgroundSnapshot: file(name: { eq: "playground-snapshot" }) {
      id
      childImageSharp {
        gatsbyImageData
      }
    }
  }
`
