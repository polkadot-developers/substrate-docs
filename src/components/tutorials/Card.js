import React from 'react'

import Link from '../default/Link'
import { Image } from '../default/resolvers/Image'

const TutorialCard = ({ model }) => {
  const { frontmatter, fields } = model
  const { title, description, featured_image } = frontmatter
  const { path } = fields
  // const imageData = getImage(featured_image)

  return (
    <article>
      <Link to={path}>
        <article className="rounded overflow-hidden bg-substrateGray-light dark:bg-substrateDark">
          {featured_image && <Image src={featured_image} />}
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
