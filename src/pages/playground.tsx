import React from 'react'
import { useIntl } from 'react-intl'
import Layout from '../components/Layout'
import { DarkButton } from '../components/Buttons'
import PlaygroundCard from '../components/PlaygroundCard'
import iconOne from '../images/box-icon.svg'
import iconTwo from '../images/lightening-icon.svg'
import iconThree from '../images/squiqqly-lines.svg'

export default function playground() {
  const intl = useIntl()
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
        <DarkButton
          external={true}
          text={`${intl.formatMessage({ id: 'playground-github-cta' })}`}
          link={`https://www.github.com`}
        />
      </section>
      <section className="container px-4">
        <div className="text-2xl md:text-6xl my-8 font-bold text-center">
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
    </Layout>
  )
}
