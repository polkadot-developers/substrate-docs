import React from 'react'
import { SecondaryButton } from '../Buttons'

interface FeedbackWidgetProps {
  title: string
  section: string
  slug: string
}
export function FeedbackWidget({ title, slug, section }: FeedbackWidgetProps) {
  const githubLink =
    'https://github.com/substrate-developer-hub/substrate-docs/issues/new?'
  const githubTitle = `Feedback On - ${section}/${title}`
  const body = `Feedback body - hey I can also insert \`${slug}\` here ;-)`
  return (
    <div>
      <h4 className="pt-10">Was This Page Helpful?</h4>
      <SecondaryButton
        external
        link={`${githubLink}title=${githubTitle}&body=${body}&labels=feedback`}
      >
        Help us improve
      </SecondaryButton>
    </div>
  )
}
