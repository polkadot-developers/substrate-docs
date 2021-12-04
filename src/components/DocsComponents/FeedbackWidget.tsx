import React from 'react'
import Icon from '../Icon'
import { SecondaryButton } from '../Buttons'

interface FeedbackWidgetProps {
  title: string
  section: string
  slug: string
}

export function FeedbackWidget({ title, slug, section }: FeedbackWidgetProps) {
  const githubLink =
    'https://github.com/substrate-developer-hub/substrate-docs/'
  const githubTitle = `Issue in - ${section} - ${title} - ${slug}`
  return (
    <div>
      <div className="flex items-center pt-10 mb-4">
        <Icon
          name="flag"
          className="mr-2 fill-current text-substrateDark dark:text-substrateWhite"
        />
        <span className="text-xl font-semibold">
          Run into problems?
        </span>
      </div>

      <SecondaryButton
        external
        link={`${githubLink}issues/new/choose?title=${githubTitle}`}
      >
      <div className="flex items-center p-2 m-0">
        <span className="font-semibold">
          Let us Know
        </span>
        <Icon
          name="github"
          className="m-2 fill-current dark:text-substrateDark text-substrateWhite"
        />
		<Icon
          name="externalIcon"
          className="fill-current dark:text-substrateDark text-substrateWhite"
        />
      </div>
      </SecondaryButton>
    </div>
  )
}
