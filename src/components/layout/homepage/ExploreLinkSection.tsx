import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Icon from '../../Icon'
import { TextButton } from '../../Buttons'

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
  const { site } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          substrateIO
        }
      }
    }
  `)
  const exploreLinks = {
    technology: {
      title: 'Technology',
      description:
        'Learn why Substrate is the most powerful framework for quickly building customized, future-proof blockchains',
      link: `${site.siteMetadata.substrateIO}/technology`,
      linkText: 'Explore the Tech',
      icon: 'diamondGreen',
    },
    developerHub: {
      title: 'Developer Hub',
      description:
        'Dive into documentation, tutorials, and resources to immediately get started building with Substrate',
      link: '/',
      linkText: 'Start building',
      icon: 'diamondPink',
    },
    vision: {
      title: 'Vision',
      description:
        'Substrate is the backbone of the Polkadot ecosystem, building the decentralized and fair internet of the future',
      link: `${site.siteMetadata.substrateIO}/vision/substrate-and-polkadot`,
      linkText: 'Discover more',
      icon: 'diamondPurple',
    },
    ecosystem: {
      title: 'Ecosystem',
      description:
        'Access resources, maximize opportunities, and connect with a thriving network of Substrate enthusiasts and builders',
      link: `${site.siteMetadata.substrateIO}/ecosystem`,
      linkText: 'Check out the Ecosystem',
      icon: 'diamondYellow',
    },
    projects: {
      title: 'Projects',
      description:
        'See how Substrate has been implemented by innovative teams in many industries around the world',
      link: `${site.siteMetadata.substrateIO}/ecosystem/projects`,
      linkText: 'Meet The Teams',
      icon: 'diamondYellow',
    },
  }
  links.forEach((link: string) => {
    currentLinks.push(exploreLinks[`${link}`])
  })

  return (
    <div className="bg-substrateGray-light dark:bg-darkBackground pb-10 pt-20">
      <section className="container mb-20 lg:px-10">
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
