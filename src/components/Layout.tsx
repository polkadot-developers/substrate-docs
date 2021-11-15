import React, { useEffect } from 'react'
import AOS from 'aos'
import { MDXProvider } from '@mdx-js/react'
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
  Img,
} from './DocsComponents'
import Header from './Header/Header'
import Footer from './Footer'
import Banner from './Banner'

const components = {
  img: Img,
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
      <Banner />
      <Header />
      <main className="main-container">
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Layout
