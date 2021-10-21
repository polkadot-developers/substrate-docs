import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

interface ImgProps {
  src: string
  alt: string
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
          }
        }
      }
    }
  `)
  const image = allFile.edges.find(edge => {
    return `${edge.node.name}.png` === src
  })

  const currentImage = getImage(image.node.childImageSharp.gatsbyImageData)
  console.log(image)
  return <GatsbyImage image={currentImage} alt={alt} />
}
