import * as React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { MdxLink } from 'gatsby-theme-i18n'
import Message from '../components/Docs/Message'
import Header from './Header'
import Footer from './Footer'

const components = {
  a: MdxLink,
  Message,
}

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      <main className="min-h-screen">
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default Layout
