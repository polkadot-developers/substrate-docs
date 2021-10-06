import React, { useEffect } from 'react'
import AOS from 'aos'
import { MDXProvider } from '@mdx-js/react'
// import { MdxLink } from 'gatsby-theme-i18n'
import {
  Message,
  PreviousButton,
  NextButton,
  RelatedMaterialBlock,
  Objectives,
  TutorialObjective,
  RelevantSkills,
  SkillsYouGain,
  AccentButton,
  DarkButton,
  FastTrackPlayground,
  ExternalLink,
  MdxLink,
} from './DocsComponents'
import Header from './Header/Header'
import Footer from './Footer'

const components = {
  a: MdxLink,
  Message,
  PreviousButton,
  NextButton,
  RelatedMaterialBlock,
  Objectives,
  TutorialObjective,
  RelevantSkills,
  SkillsYouGain,
  AccentButton,
  DarkButton,
  FastTrackPlayground,
  ExternalLink,
}

const Layout = ({ children }: any) => {
  useEffect(() => {
    AOS.init({
      disable: 'mobile',
      duration: 600,
    })
  }, [])

  return (
    <React.Fragment>
      <Header />
      <main className="main-container">
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Layout
