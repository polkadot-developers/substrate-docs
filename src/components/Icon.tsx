import React from 'react'

import docsIcon from '../images/svgs/docs-icon.svg'
import htgIcon from '../images/svgs/htg.svg'
import tutsIcon from '../images/svgs/tuts.svg'
import feTemplate from '../images/svgs/fe-template.svg'
import nodeTemplate from '../images/svgs/node-template.svg'
import elementOrg from '../images/svgs/element-original.svg'
import stackOverflowOrg from '../images/svgs/stack-overflow-original.svg'
import gradHat from '../images/svgs/grad-hat.svg'
import calendar from '../images/svgs/calendar.svg'
import grantsDollar from '../images/svgs/grants-dollar.svg'
import ideCode from '../images/svgs/ide-code.svg'
import diamondYellow from '../images/svgs/diamond-yellow.svg'
import diamondPurple from '../images/svgs/diamond-purple.svg'
import diamondGreen from '../images/svgs/diamond-green.svg'
import arrowMore from '../images/svgs/arrow-more.svg'
import flag from '../images/svgs/flag.svg'
import github from '../images/svgs/github-small.svg'
import docsNavIcon from '../images/svgs/docs-nav-icon.svg'
import arrowDown from '../images/svgs/arrow-down.svg'
import copyText from '../images/svgs/copy-text.svg'
import elementWhite from '../images/svgs/element-white.svg'
import stackOverflowWhite from '../images/svgs/stack-overflow-white.svg'
import twitter from '../images/svgs/twitter.svg'
import feedbackIcon from '../images/svgs/feedback-icon.svg'

const iconsMap = new Map()
/* homepage */
iconsMap.set('docsIcon', docsIcon)
iconsMap.set('htgIcon', htgIcon)
iconsMap.set('tutsIcon', tutsIcon)
iconsMap.set('gradHat', gradHat)
iconsMap.set('calendar', calendar)
iconsMap.set('grantsDollar', grantsDollar)
iconsMap.set('ideCode', ideCode)
iconsMap.set('diamondGreen', diamondGreen)
iconsMap.set('diamondYellow', diamondYellow)
iconsMap.set('diamondPurple', diamondPurple)
/* playground */
iconsMap.set('feTemplate', feTemplate)
iconsMap.set('nodeTemplate', nodeTemplate)
/* social-media */
iconsMap.set('elementOrg', elementOrg)
iconsMap.set('elementWhite', elementWhite)
iconsMap.set('stackOverflowOrg', stackOverflowOrg)
iconsMap.set('stackOverflowWhite', stackOverflowWhite)
iconsMap.set('github', github)
iconsMap.set('twitter', twitter)
/* UI specific */
iconsMap.set('arrowMore', arrowMore)
iconsMap.set('arrowDown', arrowDown)
iconsMap.set('flag', flag)
iconsMap.set('docsNavIcon', docsNavIcon)
iconsMap.set('copyText', copyText)
iconsMap.set('feedbackIcon', feedbackIcon)

interface IconProps {
  name: string
  className?: string
}

export default function Icon({ name, className }: IconProps) {
  if (!name) return <span className="w-5"></span>
  const IconComponent = iconsMap.get(name)
  if (!IconComponent) return <span className="w-5"></span>
  return <IconComponent name={name} className={className}></IconComponent>
}
