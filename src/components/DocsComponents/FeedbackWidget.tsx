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
          name="feedbackIcon"
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
        Please, help us improve
      </SecondaryButton>
    </div>
  )
}
