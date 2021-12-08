import React from 'react'
import Icon from '../Icon'
import { SecondaryButton } from '../Buttons'

export function FeedbackWidget() {
  const githubLink =
    'https://github.com/substrate-developer-hub/substrate-docs/issues/new/choose'
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
        link={`${githubLink}`}
      >
      <div className="flex items-center pt-2 mb-2">
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
