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
  const githubTitle = `Feedback Submission - ${section}/${title}`
  return (
    <div>
      <div className="flex items-center pt-10 mb-4">
        <span className="text-xl font-semibold">Was This Page Helpful?</span>
      </div>

      <SecondaryButton
        external
        link={`${githubLink}title=${githubTitle}&template=feedback-template.md&labels=feedback`}
      >
        <div className="flex items-center">
          <Icon
            name="feedbackIcon"
            className="mr-2 fill-current text-subtrateDark dark:text-substrateWhite"
          />
          Help us improve
        </div>
      </SecondaryButton>
    </div>
    // <div>
    //   <div className="flex items-center pt-10 mb-4">
    //     <Icon
    //       name="feedbackIcon"
    //       className="mr-2 fill-current text-subtrateDark dark:text-substrateWhite"
    //     />
    //     <span className="text-xl font-semibold">Was This Page Helpful?</span>
    //   </div>

    //   <SecondaryButton
    //     external
    //     link={`${githubLink}title=${githubTitle}&body=${body}&labels=feedback`}
    //   >
    //     Help us improve
    //   </SecondaryButton>
    // </div>
  )
}
