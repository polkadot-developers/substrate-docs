import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

interface ImgProps {
  src: string
  alt: string
  node: {
    name: string
    ext: string
  }
}

export function Img({ src, alt }: ImgProps) {
  const { allFile } = useStaticQuery(graphql`
    {
      allFile(
        filter: { sourceInstanceName: { eq: "images" }, ext: { eq: ".png" } }
      ) {
        edges {
          node {
            id
            childImageSharp {
              gatsbyImageData
            }
            name
            ext
          }
        }
      }
    }
  `)
  const image = allFile.edges.find((edge: ImgProps) => {
    return `${edge.node.name}${edge.node.ext}` === src
  })

  const currentImage = getImage(image.node.childImageSharp.gatsbyImageData)
  return <GatsbyImage as={'span'} image={currentImage} alt={alt} />
}
