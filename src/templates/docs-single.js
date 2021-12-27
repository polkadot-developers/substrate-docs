import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import NavDocs from '../components/site/NavDocs'
import SEO from '../components/SEO'
import Sidebar from '../components/layout/Sidebar'
import TableOfContents from '../components/site/TableOfContents'
import Markdown from '../components/default/Markdown'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const DocsTemplate = ({ data, pageContext }) => {
  const { markdownRemark } = data
  const { htmlAst, tableOfContents, frontmatter } = markdownRemark
  const { title, featured_image } = frontmatter
  const { pagePath, collection } = pageContext

  const imageData = getImage(featured_image)

  return (
    <Layout>
      <SEO title={title} />
      <div className="flex flex-col lg:flex-row">
        <Sidebar>
          <NavDocs currentPath={pagePath} />
        </Sidebar>

        <article className="px-4 mb-20 lg:flex lg:mx-auto">
          <div className="lg:flex-grow">
            <div className="py-8 lg:flex lg:justify-between lg:items-center">
              <div className="text-sm text-gray-400">
                WIP: Header: Breadcrumbs, Version, Edit
                <div>Collection: {collection}</div>
              </div>
            </div>
            <div className="w-screen max-w-full lg:max-w-2xl 2xl:max-w-3xl markdown-body mdx-anchor">
              <header>
                <h1>{title}</h1>
                <figure>
                  {imageData && (
                    <GatsbyImage
                      image={imageData}
                      alt={`${title} Featured Image`}
                    />
                  )}
                  <figcaption>Featured image</figcaption>
                </figure>
              </header>
              <main>
                <Markdown htmlAst={htmlAst} />
              </main>
              <footer>
                <div className="py-8">
                  WIP: Footer: Last edit
                  <hr />
                  Issue report
                </div>
              </footer>
            </div>
          </div>

          <div className="hidden xl:inline-block">
            <TableOfContents data={tableOfContents} />
          </div>
        </article>
      </div>
    </Layout>
  )
}

export default DocsTemplate

export const query = graphql`
  query ($slug: String!) {
    markdownRemark(
      fields: { slug: { eq: $slug } }
      fileAbsolutePath: { regex: "//(docs)/" }
    ) {
      htmlAst
      tableOfContents(maxDepth: 2)
      frontmatter {
        title
        featured_image {
          childImageSharp {
            gatsbyImageData(
              width: 1600
              placeholder: NONE
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`
