import React from 'react'
import Icon from '../../Icon'

export default function CommunityCard() {
  return (
    <div className="px-6 sm:flex sm:flex-wrap sm:justify-center xl:justify-evenly">
      <div className="h-[410px]] w-full sm:w-80 2xl:w-96 shadow-xl py-8 px-6 mb-4 sm:m-4 bg-white dark:bg-substrateDark mdx-anchor">
        <div className="text-2xl font-bold mb-5">Contact</div>
        <p>
          cryptographic research and comes with peer-to-peer networking,
          consensus. MISSING COPY
        </p>
        <hr />
        <p>
          <b>Join the conversation:</b>
        </p>
        <div className="flex items-center mb-6">
          <Icon name="elementOrg" className="mr-3" />
          <a href={'#'} target="_blank" rel="noreferrer">
            Element
          </a>
        </div>
        <hr />
        <p>
          <b>Find answers:</b>
        </p>
        <div className="flex items-center mb-6">
          <Icon name="stackOverflowOrg" className="mr-3" />
          <a href={'#'} target="_blank" rel="noreferrer">
            Stack Overflow
          </a>
        </div>
      </div>
      <div className="h-[410px]] w-full sm:w-80 2xl:w-96 shadow-xl py-8 px-6 mb-4 sm:m-4 bg-white dark:bg-substrateDark mdx-anchor">
        <div className="text-2xl font-bold mb-5">Seminars & Events</div>
        <p>
          Get insights from others building on Substrate, get your questions
          answered, and build your network.
        </p>
        <hr />
        <p>
          <b>Participate:</b>
        </p>
        <div className="flex items-center mb-6">
          <Icon
            name="gradHat"
            className="mr-3 fill-current text-SubstrateDark dark:text-substrateWhite"
          />
          <a href={'#'} target="_blank" rel="noreferrer">
            Substrate Seminar
          </a>
        </div>
        <hr />
        <p>
          <b>Learn more:</b>
        </p>
        <div className="flex items-center mb-6">
          <Icon
            name="calendar"
            className="mr-3 fill-current text-SubstrateDark dark:text-substrateWhite"
          />
          <a href={'#'} target="_blank" rel="noreferrer">
            Events
          </a>
        </div>
      </div>
      <div className="h-[410px]] w-full sm:w-80 2xl:w-96 shadow-xl py-8 px-6 mb-4 sm:m-4 bg-white dark:bg-substrateDark mdx-anchor">
        <div className="text-2xl font-bold mb-5">Hackathons & Grants</div>
        <p>
          cryptographic research and comes with peer-to-peer networking,
          consensus. MISSING COPY
        </p>
        <hr />
        <p>
          <b>Rise to the challenge:</b>
        </p>
        <div className="flex items-center mb-6">
          <Icon
            name="ideCode"
            className="mr-3 fill-current text-SubstrateDark dark:text-substrateWhite"
          />
          <a href={'#'} target="_blank" rel="noreferrer">
            Hackathons
          </a>
        </div>
        <hr />
        <p>
          <b>Get funding:</b>
        </p>
        <div className="flex items-center mb-6">
          <Icon
            name="grantsDollar"
            className="mr-3 fill-current text-SubstrateDark dark:text-substrateWhite"
          />
          <a href={'#'} target="_blank" rel="noreferrer">
            Grants
          </a>
        </div>
      </div>
    </div>
  )
}
