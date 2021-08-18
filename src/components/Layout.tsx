import * as React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MdxLink } from 'gatsby-theme-i18n'
import {
  Message,
  PreviousButton,
  NextButton,
  RelatedMaterialBlock,
  Objectives,
  TutorialObjective,
  SkillsYouNeed,
  SkillsYouGain,
  AccentButton,
  DarkButton,
  FastTrackPlayground,
  ExternalLink,
} from './DocsComponents'
import Header from './Header/Header'
// import Footer from './Footer'
import Footer2 from './Footer2'

const components = {
  a: MdxLink,
  Message,
  PreviousButton,
  NextButton,
  RelatedMaterialBlock,
  Objectives,
  TutorialObjective,
  SkillsYouNeed,
  SkillsYouGain,
  AccentButton,
  DarkButton,
  FastTrackPlayground,
  ExternalLink,
}

const Layout = ({ children }: any) => {
  return (
    <React.Fragment>
      <Header />
      <main className="min-h-screen">
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
      <Footer2 />
    </React.Fragment>
  )
}

export default Layout
