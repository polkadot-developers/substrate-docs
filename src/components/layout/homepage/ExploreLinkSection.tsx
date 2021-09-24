import React from 'react'

import Icon from '../../Icon'
// import LineArrowButton from '../../ui/LineArrowButton';
import { TextButton } from '../../Buttons'

const exploreLinks = {
  technology: {
    title: 'Technology',
    description:
      'Learn why Substrate is the most powerful framework for quickly building customized, future-proof blockchains',
    link: 'https://www.substrate.io/technology',
    linkText: 'Explore the Tech',
    icon: 'diamondGreen',
  },
  developerHub: {
    title: 'Developer Hub',
    description:
      'Dive into documentation, tutorials, and resources to immediately get started building with Substrate',
    link: 'http://docs.substrate.io/',
    linkText: 'Start building',
    icon: 'diamondPink',
  },
  vision: {
    title: 'Vision',
    description:
      'Substrate is the backbone of the Polkadot ecosystem, building the decentralized and fair internet of the future',
    link: 'https://www.substrate.io/vision/substrate-and-polkadot',
    linkText: 'Discover more',
    icon: 'diamondPurple',
  },
  ecosystem: {
    title: 'Ecosystem',
    description:
      'Access resources, maximize opportunities, and connect with a thriving network of Substrate enthusiasts and builders',
    link: 'https://www.substrate.io/ecosystem',
    linkText: 'Check out the Ecosystem',
    icon: 'diamondYellow',
  },
  projects: {
    title: 'Projects',
    description:
      'See how Substrate has been implemented by innovative teams in many industries around the world',
    link: 'https://www.substrate.io/ecosystem/projects',
    linkText: 'Meet The Teams',
    icon: 'diamondYellow',
  },
}

interface ExploreLinkSectionProps {
  links: string[]
}

interface ICurrentLinks {
  title: string
  description: string
  link: string
  linkText: string
  icon: string
}

const ExploreLinkSection = ({ links }: ExploreLinkSectionProps) => {
  const currentLinks: ICurrentLinks[] = []

  links.forEach((link: string) => {
    currentLinks.push(exploreLinks[link])
  })

  return (
    <div className="bg-substrateGray-light dark:bg-darkBackground pb-10 pt-20">
      <section className="px-6 xl:container mb-20">
        <h4 className="text-2xl font-bold mb-16">Explore More Substrate</h4>
        <div className="sm:grid grid-cols-3 gap-6 xl:gap-24">
          {currentLinks.map(
            ({ title, description, link, linkText, icon }, index) => (
              <div
                key={index}
                className="mb-16 sm:mb-0 flex flex-col justify-between"
              >
                <div>
                  <Icon name={icon} className="mb-6 w-8 h-8" />
                  <h5 className="text-xl font-bold mb-6">{title}</h5>
                  <p>{description}</p>
                </div>
                <TextButton external link={link}>
                  {linkText}
                </TextButton>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  )
}

export default ExploreLinkSection
