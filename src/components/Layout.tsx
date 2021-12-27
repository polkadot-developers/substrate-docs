import React, { useEffect } from 'react'
import AOS from 'aos'
// import { MDXProvider } from '@mdx-js/react'
// import {
//   Message,
//   PreviousButton,
//   NextButton,
//   RelatedMaterialBlock,
//   Objectives,
//   TutorialObjective,
//   RelevantSkills,
//   SkillsYouGain,
//   AccentButton,
//   DarkButton,
//   FastTrackPlayground,
//   ExternalLink,
//   MdxLink,
// } from './DocsComponents'
import Header from './Header/Header'
import Footer from './Footer'
import Banner from './site/Banner'

// const components = {
//   a: MdxLink,
//   Message,
//   PreviousButton,
//   NextButton,
//   RelatedMaterialBlock,
//   Objectives,
//   TutorialObjective,
//   RelevantSkills,
//   SkillsYouGain,
//   AccentButton,
//   DarkButton,
//   FastTrackPlayground,
//   ExternalLink,
// }

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    AOS.init({
      disable: 'mobile',
      duration: 600,
    })
  }, [])

  return (
    <>
      <Banner />
      <Header />
      <main className="main-container">
        {children}
        {/* <MDXProvider components={components}>{children}</MDXProvider> */}
      </main>
      <Footer />
    </>
  )
}

export default Layout
