import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import React from 'react'

import Link from '../Link'

const TutorialCard = ({ model }) => {
  const { frontmatter, fields } = model
  const { title, description, featured_image } = frontmatter
  const { path } = fields
  const imageData = getImage(featured_image)

  return (
    <article>
      <Link to={path}>
        <article className="rounded overflow-hidden bg-substrateGray-light dark:bg-substrateDark">
          {imageData && (
            <GatsbyImage
              image={imageData}
              alt={`${title} Tutorial Thumbnail`}
            />
          )}
          <div className="p-4">
            <h4 className="mb-4">{title}</h4>
            <p className="text-sm md:text-base">{description}</p>
          </div>
        </article>
      </Link>
    </article>
  )
}

export default TutorialCard
