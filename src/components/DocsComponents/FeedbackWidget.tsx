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
    'https://github.com/substrate-developer-hub/substrate-docs/issues/new?'
  const githubTitle = `Feedback Submission - ${section} / ${title}`
  const currentSection = () => {
    if (section === 'how to guides') {
      return 'Guide'
    }
    if (section === 'tutorials') {
      return 'Tutorial'
    }
    return 'Page'
  }
  return (
    <div>
      <div className="flex items-center pt-10 mb-4">
        <Icon
          name="feedbackIcon"
          className="mr-2 fill-current text-subtrateDark dark:text-substrateWhite"
        />
        <span className="text-xl font-semibold">
          Was This {currentSection()} Helpful?
        </span>
      </div>

      <SecondaryButton
        external
        link={`${githubLink}title=${githubTitle}&template=feedback-template.md&labels=feedback`}
      >
        Help us improve
      </SecondaryButton>
    </div>
  )
}
