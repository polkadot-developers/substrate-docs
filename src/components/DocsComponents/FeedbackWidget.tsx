import React from 'react'
import { SecondaryButton } from '../Buttons'

export function FeedbackWidget() {
  return (
    <div>
      <h4 className="pt-10">Was This Page Helpful?</h4>
      <SecondaryButton
        external
        link="https://github.com/substrate-developer-hub/substrate-docs/issues/new"
      >
        Help us improve
      </SecondaryButton>
    </div>
  )
}
