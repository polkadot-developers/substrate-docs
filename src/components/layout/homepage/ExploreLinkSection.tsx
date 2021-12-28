import React from 'react'
import Icon from '../../Icon'
import Section from '../Section'
import { useSiteMetadata } from '../../Hooks/use-site-metadata'
import Link from '../../default/Link'

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
  const { siteMetadata } = useSiteMetadata()
  const currentLinks: ICurrentLinks[] = []
  const exploreLinks = new Map()
  exploreLinks.set('technology', {
    title: 'Technology',
    description:
      'Learn why Substrate is the most powerful framework for quickly building customized, future-proof blockchains',
    link: `${siteMetadata.substrateIO}/technology`,
    linkText: 'Explore the Tech',
    icon: 'diamondGreen',
  })

  exploreLinks.set('developerHub', {
    title: 'Developer Hub',
    description:
      'Dive into documentation, tutorials, and resources to immediately get started building with Substrate',
    link: '/',
    linkText: 'Start building',
    icon: 'diamondPink',
  })
  exploreLinks.set('vision', {
    title: 'Vision',
    description:
      'Substrate is the backbone of the Polkadot ecosystem, building the decentralized and fair internet of the future',
    link: `${siteMetadata.substrateIO}/vision/substrate-and-polkadot`,
    linkText: 'Discover more',
    icon: 'diamondPurple',
  })
  exploreLinks.set('ecosystem', {
    title: 'Ecosystem',
    description:
      'Access resources, maximize opportunities, and connect with a thriving network of Substrate enthusiasts and builders',
    link: `${siteMetadata.substrateIO}/ecosystem`,
    linkText: 'Check out the Ecosystem',
    icon: 'diamondYellow',
  })
  exploreLinks.set('projects', {
    title: 'Projects',
    description:
      'See how Substrate has been implemented by innovative teams in many industries around the world',
    link: `${siteMetadata.substrateIO}/ecosystem/projects`,
    linkText: 'Meet The Teams',
    icon: 'diamondYellow',
  })
  links.forEach((link: string) => {
    currentLinks.push(exploreLinks.get(link))
  })

  return (
    <div className="pb-10 pt-20 bg-substrateGray-light dark:bg-substrateGray-darkest">
      <Section>
        <h4 className="text-2xl font-bold mb-16">Explore More Substrate</h4>
        <div className="md:grid grid-cols-3 gap-6 xl:gap-10">
          {currentLinks.map(
            ({ title, description, link, linkText, icon }, index) => (
              <Link key={index} to={link}>
                <div className="h-full hover:bg-white hover:shadow-xl hover:scale-105 rounded-md p-8 mb-16 sm:mb-0 flex flex-col justify-between transition-all dark:hover:bg-substrateDark">
                  <div>
                    <Icon name={icon} className="mb-6 w-8 h-8" />
                    <h5 className="text-xl font-bold mb-6">{title}</h5>
                    <p>{description}</p>
                  </div>
                  <div>
                    <p
                      className={`font-bold pb-1 mr-0.5 border-b-2 inline hover:mr-2 transition-all border-substrateDark dark:border-white`}
                    >
                      {linkText}
                    </p>{' '}
                    <span
                      className={`fill-current text-substrateDark dark:text-white inline-block`}
                    >
                      <Icon name="arrowMore" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </Section>
    </div>
  )
}

export default ExploreLinkSection
