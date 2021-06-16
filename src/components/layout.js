import * as React from "react"
import { MDXProvider } from "@mdx-js/react"
import { MdxLink, LocalizedLink } from "gatsby-theme-i18n"

const components = {
  a: MdxLink,
}

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <header>
        <LocalizedLink to="/">Home</LocalizedLink>
      </header>
      <main>
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
    </React.Fragment>
  )
}

export default Layout
