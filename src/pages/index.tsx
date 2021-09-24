import * as React from 'react'
// import { graphql } from 'gatsby'
// import { LocalizedLink } from 'gatsby-theme-i18n'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useIntl } from 'react-intl'
import { PrimaryFixedButton } from '../components/Buttons'
import DocCard from '../components/layout/homepage/DocCard'
import CommunityCard from '../components/layout/homepage/CommunityCard'
import { StaticImage } from 'gatsby-plugin-image'
import { SecondaryButton } from '../components/Buttons'
import ExploreDocs from '../components/layout/homepage/ExploreDocs'

export default function Index() {
  const intl = useIntl()

  return (
    <Layout>
      <SEO title="Documentation Home" />
      <section className="xl:container my-20 md:mt-20 md:mb-36 lg:mt-40 lg:mb-60">
        <div className="flex flex-col md:flex-row md:items-center px-6">
          <div className="lg:m-0 mb-10 md:w-1/2 md:px-5 lg:px-10">
            <div className="text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6">
              Substrate <br /> Develop Hub
            </div>
            <h4 className="text-xl xl:text-3xl font-semibold">
              Substrate developer knowledge base
            </h4>
            <p className="max-w-lg">
              Substrate is powered by best-in-class cryptographic research and
              comes with peer-to-peer networking, consensus mechanisms, and much
              more.
            </p>
            <PrimaryFixedButton link="/v3">Get Started</PrimaryFixedButton>
          </div>
          <div className="flex justify-center md:w-1/2">
            <div className="bg-gray-200 w-96 h-96"></div>
          </div>
        </div>
      </section>
      {/* ////////////////////// */}
      {/* Learn Subsrate Section */}
      {/* ////////////////////// */}
      <section className="relative px-6 xl:container md:mt-20 md:mb-36 lg:mt-40 lg:mb-60 h-full">
        <div className="absolute inset-0 md:mt-20">
          <div className="lg:hidden">
            <StaticImage
              src={'../images/backgrounds/backgroundTwo.png'}
              alt={'Learn Substrate Background'}
              layout="constrained"
            />
          </div>
          <div className="hidden lg:block">
            <StaticImage
              src={'../images/backgrounds/backgroundOne.png'}
              alt={'Learn Substrate Background'}
            />
          </div>
        </div>
        <div className="h-full relative">
          <div className="text-center mb-16">
            <h1>Learn Substrate</h1>
            <h4 className="text-xl xl:text-3xl font-semibold">
              Substrate developer knowledge base
            </h4>
          </div>
          <div className="sm:flex sm:flex-wrap sm:justify-center">
            <DocCard
              title={`Documentation`}
              text={`cryptographic research and comes with peer-to-peer networking, consensus mechanisms, and much more. After tutorial You will be able.`}
              link={`/v3`}
              cta={`Explore Tech`}
            />
            <DocCard
              title={`How-To Guides`}
              text={`cryptographic research and comes with peer-to-peer networking, consensus mechanisms, and much more. After tutorial You will be able.`}
              link={`/how-to-guides`}
              cta={`Start Coding`}
            />
            <DocCard
              title={`Tutorials`}
              text={`cryptographic research and comes with peer-to-peer networking, consensus mechanisms, and much more. After tutorial You will be able.`}
              link={`/tutorials`}
              cta={`Meet teams`}
            />
          </div>
        </div>
      </section>
      {/* ////////////////// */}
      {/* Playground Section */}
      {/* ////////////////// */}
      <section className="px-6 my-40 lg:px-0 lg:h-[630px] lg:overflow-hidden">
        <div className="lg:flex lg:items-start">
          <div className="lg:pl-6 lg:w-1/2 lg:pt-20">
            <div className="flex justify-center">
              <div>
                <div className="text-5xl xl:text-7xl font-extrabold mb-8">
                  Playground
                </div>
                <h4 className="text-xl font-semibold">
                  Set up a cloud sandbox
                </h4>
                <p className="max-w-lg">
                  We recommend picking a sandbox, particularly if you&apos;re
                  just getting started. Building on Substrate requires different
                  pieces of technology. Using a sandbox allows you to skip
                  preliminary set-up and prerequisites to get to the parts that
                  are important to you.
                </p>
                <div className="flex items-center my-8">
                  <svg
                    className={`fill-current text-substrateDark dark:text-substrateWhite`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="22"
                    viewBox="0 0 42 22"
                  >
                    <path d="M8.4 11C8.4 11.7425 8.45906 12.4781 8.57063 13.2L0.7875 13.2C0.354375 13.2 0 12.8287 0 12.375L0 9.625C0 9.17125 0.354375 8.8 0.7875 8.8L8.57063 8.8C8.45906 9.52187 8.4 10.2575 8.4 11ZM41.2125 8.8L33.4294 8.8C33.5475 9.52187 33.6 10.2575 33.6 11C33.6 11.7425 33.5409 12.4781 33.4294 13.2L41.2125 13.2C41.6456 13.2 42 12.8287 42 12.375L42 9.625C42 9.17125 41.6456 8.8 41.2125 8.8ZM21 8.1125C19.4775 8.1125 18.2437 9.405 18.2437 11C18.2437 12.595 19.4775 13.8875 21 13.8875C22.5225 13.8875 23.7563 12.595 23.7563 11C23.7563 9.405 22.5225 8.1125 21 8.1125ZM21 0C26.8013 0 31.5 4.9225 31.5 11C31.5 17.0775 26.8013 22 21 22C15.1987 22 10.5 17.0775 10.5 11C10.5 4.9225 15.1987 0 21 0Z" />
                  </svg>
                  <div className="text-xl ml-4 font-extrabold">
                    Node Playground
                  </div>
                </div>
                <div className="flex items-center mt-8 mb-16">
                  <svg
                    className={`fill-current text-substrateDark dark:text-substrateWhite`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="25"
                    viewBox="0 0 42 37"
                  >
                    <path d="M38.0625 0H3.9375C1.76367 0 0 1.77567 0 3.96429V33.0357C0 35.2243 1.76367 37 3.9375 37H38.0625C40.2363 37 42 35.2243 42 33.0357V3.96429C42 1.77567 40.2363 0 38.0625 0ZM21 6.60714C21 5.14531 22.173 3.96429 23.625 3.96429C25.077 3.96429 26.25 5.14531 26.25 6.60714C26.25 8.06897 25.077 9.25 23.625 9.25C22.173 9.25 21 8.06897 21 6.60714ZM13.125 6.60714C13.125 5.14531 14.298 3.96429 15.75 3.96429C17.202 3.96429 18.375 5.14531 18.375 6.60714C18.375 8.06897 17.202 9.25 15.75 9.25C14.298 9.25 13.125 8.06897 13.125 6.60714ZM5.25 6.60714C5.25 5.14531 6.42305 3.96429 7.875 3.96429C9.32695 3.96429 10.5 5.14531 10.5 6.60714C10.5 8.06897 9.32695 9.25 7.875 9.25C6.42305 9.25 5.25 8.06897 5.25 6.60714ZM38.0625 32.5402C38.0625 32.8127 37.841 33.0357 37.5703 33.0357H4.42969C4.15898 33.0357 3.9375 32.8127 3.9375 32.5402V13.2143H38.0625V32.5402Z" />
                  </svg>
                  <div className="text-xl ml-4 font-extrabold">
                    Front-End Template Playground
                  </div>
                </div>
                <SecondaryButton cta link="/playground">
                  Explore Playground
                </SecondaryButton>
              </div>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2 lg:-translate-y-8">
            <StaticImage
              backgroundColor="transparent"
              src="../images/playground-hero.png"
              alt="Substrate Playground"
              layout="fixed"
            />
          </div>
        </div>
      </section>
      {/* <section className="xl:container my-20 md:mt-20 md:mb-36">
        <div className="flex flex-col md:flex-row md:items-center px-6">
          <div className="mb-16 lg:m-0 md:w-1/2 md:px-5 lg:px-10">
            <div className="text-5xl xl:text-7xl font-extrabold mb-8">
              Playground
            </div>
            <h4 className="text-xl font-semibold">Set up a cloud sandbox</h4>
            <p className="max-w-lg">
              We recommend picking a sandbox, particularly if you&apos;re just
              getting started. Building on Substrate requires different pieces
              of technology. Using a sandbox allows you to skip preliminary
              set-up and prerequisites to get to the parts that are important to
              you.
            </p>
            <div className="flex items-center my-8">
              <svg
                className={`fill-current text-substrateDark dark:text-substrateWhite`}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="22"
                viewBox="0 0 42 22"
              >
                <path d="M8.4 11C8.4 11.7425 8.45906 12.4781 8.57063 13.2L0.7875 13.2C0.354375 13.2 0 12.8287 0 12.375L0 9.625C0 9.17125 0.354375 8.8 0.7875 8.8L8.57063 8.8C8.45906 9.52187 8.4 10.2575 8.4 11ZM41.2125 8.8L33.4294 8.8C33.5475 9.52187 33.6 10.2575 33.6 11C33.6 11.7425 33.5409 12.4781 33.4294 13.2L41.2125 13.2C41.6456 13.2 42 12.8287 42 12.375L42 9.625C42 9.17125 41.6456 8.8 41.2125 8.8ZM21 8.1125C19.4775 8.1125 18.2437 9.405 18.2437 11C18.2437 12.595 19.4775 13.8875 21 13.8875C22.5225 13.8875 23.7563 12.595 23.7563 11C23.7563 9.405 22.5225 8.1125 21 8.1125ZM21 0C26.8013 0 31.5 4.9225 31.5 11C31.5 17.0775 26.8013 22 21 22C15.1987 22 10.5 17.0775 10.5 11C10.5 4.9225 15.1987 0 21 0Z" />
              </svg>
              <div className="text-xl ml-4 font-extrabold">Node Playground</div>
            </div>
            <div className="flex items-center my-8">
              <svg
                className={`fill-current text-substrateDark dark:text-substrateWhite`}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="25"
                viewBox="0 0 42 37"
              >
                <path d="M38.0625 0H3.9375C1.76367 0 0 1.77567 0 3.96429V33.0357C0 35.2243 1.76367 37 3.9375 37H38.0625C40.2363 37 42 35.2243 42 33.0357V3.96429C42 1.77567 40.2363 0 38.0625 0ZM21 6.60714C21 5.14531 22.173 3.96429 23.625 3.96429C25.077 3.96429 26.25 5.14531 26.25 6.60714C26.25 8.06897 25.077 9.25 23.625 9.25C22.173 9.25 21 8.06897 21 6.60714ZM13.125 6.60714C13.125 5.14531 14.298 3.96429 15.75 3.96429C17.202 3.96429 18.375 5.14531 18.375 6.60714C18.375 8.06897 17.202 9.25 15.75 9.25C14.298 9.25 13.125 8.06897 13.125 6.60714ZM5.25 6.60714C5.25 5.14531 6.42305 3.96429 7.875 3.96429C9.32695 3.96429 10.5 5.14531 10.5 6.60714C10.5 8.06897 9.32695 9.25 7.875 9.25C6.42305 9.25 5.25 8.06897 5.25 6.60714ZM38.0625 32.5402C38.0625 32.8127 37.841 33.0357 37.5703 33.0357H4.42969C4.15898 33.0357 3.9375 32.8127 3.9375 32.5402V13.2143H38.0625V32.5402Z" />
              </svg>
              <div className="text-xl ml-4 font-extrabold">
                Front-End Template Playground
              </div>
            </div>
            <SecondaryButton cta link="/playgrond">
              Explore Playground
            </SecondaryButton>
          </div>
          <div className="flex justify-center md:w-1/2">
            <StaticImage
              backgroundColor="transparent"
              src="../images/playground-hero.png"
              alt="Substrate Playground"
              layout="constrained"
            />
          </div>
        </div>
      </section> */}
      {/* ///////////////////////////// */}
      {/* Explore Documentation Section */}
      {/* ///////////////////////////// */}
      <section className="px-6 xl:container mb-40">
        <div className="mb-14">
          <div className="text-4xl md:text-5xl xl:text-7xl font-extrabold mb-8">
            Explore Documentation
          </div>
          <div className="text-xl">
            Browse through the use case specific highlights that meet your
            needs.
          </div>
        </div>
        <div className="sm:flex sm:flex-wrap sm:justify-start xl:justify-evenly">
          <ExploreDocs />
        </div>
      </section>
      {/* ////////////////////////////// */}
      {/* Connect With Community Section */}
      {/* ////////////////////////////// */}
      <section className="xl:container my-20 md:mt-20 md:mb-40">
        <div className="flex flex-col md:flex-row md:items-center px-6">
          <div className="lg:m-0 md:w-1/2 md:px-5 lg:px-10">
            <div className="text-4xl xl:text-6xl 2xl:text-7xl font-extrabold mb-8">
              Connect With <br /> The Community
            </div>
            <p className="max-w-lg">
              We recommend picking a sandbox, particularly if you&apos;re just
              getting started. Building on Substrate requires different pieces
              of technology. Using a sandbox allows you to skip preliminary
              set-up and prerequisites to get to the parts that are important
            </p>
          </div>
          <div className="flex justify-center md:w-1/2">
            <StaticImage
              backgroundColor="transparent"
              src="../images/photos/homepage/connect-with-the-community.png"
              alt="Connect With Substrate Community"
              layout="constrained"
            />
          </div>
        </div>
        <CommunityCard />
      </section>
      <section className="h-96 bg-gray-200 dark:bg-darkBackground"></section>
    </Layout>
  )
}
