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
  const body = `**Symptom**
  Describe what you saw or experienced. Did something go wrong or do you have a suggestion for improving our site?
  
  **Expected behavior**
  Describe what you expected to see or to have happened. Or if something delighted you, we'd love to know that, too.
  
  **Steps to reproduce**
  Provide the steps that led to the discovery of the issue. If something went wrong, we want to fix it!
  
  **Recommended course of action (optional)**
  If you have a suggestion for fixing the issue you found, describe what you think the fix should be.`
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
