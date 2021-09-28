import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Icon from '../../Icon'

export default function CommunityCard() {
  const { site } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          element
          stackOverflow
          substrateIO
        }
      }
    }
  `)
  const data = [
    {
      title: 'Contact',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      headingOne: 'Join the conversation',
      iconOne: 'elementOrg',
      linkTextOne: 'Element',
      linkOne: site.siteMetadata.element,
      headingTwo: 'Find answers',
      iconTwo: 'stackOverflowOrg',
      linkTextTwo: 'Stack Overflow',
      linkTwo: site.siteMetadata.stackOverflow,
    },
    {
      title: 'Seminars & Events',
      description:
        'Get insights from others building on Substrate, get your questions answered, and build your network.',
      headingOne: 'Participate',
      iconOne: 'gradHat',
      linkTextOne: 'Substrate Seminar',
      linkOne: `${site.siteMetadata.substrateIO}/ecosystem/resources/seminar`,
      headingTwo: 'Learn more',
      iconTwo: 'calendar',
      linkTextTwo: 'Events',
      linkTwo: 'https://www.parity.io/events',
    },
    {
      title: 'Hackathons & Grants',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et',
      headingOne: 'Rise to the challenge',
      iconOne: 'ideCode',
      linkTextOne: 'Hackathon',
      linkOne: `${site.siteMetadata.substrateIO}/ecosystem/opportunities/hackathons`,
      headingTwo: 'Get funding',
      iconTwo: 'grantsDollar',
      linkTextTwo: 'Grants',
      linkTwo: `${site.siteMetadata.substrateIO}/ecosystem/opportunities/grants`,
    },
  ]
  return (
    <div className="px-6 sm:flex sm:flex-col lg:flex-row sm:items-center  xl:justify-evenly">
      {data.map((item, index) => (
        <div
          key={index}
          data-aos="fade-up"
          data-aos-delay={index === 1 ? '200' : index === 2 ? '400' : ''}
          className="lg:h-[500px] xl:h-[456px] w-full sm:w-80 2xl:w-96 shadow-xl py-8 px-6 mb-4 sm:m-4 bg-white dark:bg-substrateDark mdx-anchor"
        >
          <div className="text-2xl font-bold mb-5">{item.title}</div>
          <p>{item.description}</p>
          <hr />
          <p>
            <b>{item.headingOne}:</b>
          </p>
          <div className="flex items-center mb-6">
            <Icon
              name={item.iconOne}
              className="mr-3 fill-current dark:text-subtrateWhite"
            />
            <a href={item.linkOne}>{item.linkTextOne}</a>
          </div>
          <hr />
          <p>
            <b>{item.headingTwo}:</b>
          </p>
          <div className="flex items-center mb-6">
            <Icon
              name={item.iconTwo}
              className="mr-3 fill-current dark:text-subtrateWhite"
            />
            <a href={item.linkTwo}>{item.linkTextTwo}</a>
          </div>
        </div>
      ))}
    </div>
  )
}
