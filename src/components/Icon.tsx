import React from 'react'

import docsIcon from '../images/svg/docs-icon.svg'
import htgIcon from '../images/svg/htg.svg'
import tutsIcon from '../images/svg/tuts.svg'
import feTemplate from '../images/svg/fe-template.svg'
import nodeTemplate from '../images/svg/node-template.svg'
import elementOrg from '../images/svg/element-original.svg'
import stackOverflowOrg from '../images/svg/stack-overflow-original.svg'
import gradHat from '../images/svg/grad-hat.svg'
import calendar from '../images/svg/calendar.svg'
import grantsDollar from '../images/svg/grants-dollar.svg'
import ideCode from '../images/svg/ide-code.svg'
import diamondYellow from '../images/svg/diamond-yellow.svg'
import diamondPurple from '../images/svg/diamond-purple.svg'
import diamondGreen from '../images/svg/diamond-green.svg'
import arrowMore from '../images/svg/arrow-more.svg'
import flag from '../images/svg/flag.svg'
import github from '../images/svg/github-small.svg'
import docsNavIcon from '../images/svg/docs-nav-icon.svg'
import arrowDown from '../images/svg/arrow-down.svg'
import copyText from '../images/svg/copy-text.svg'
import elementWhite from '../images/svg/element-white.svg'
import stackOverflowWhite from '../images/svg/stack-overflow-white.svg'
import twitter from '../images/svg/twitter.svg'
import feedbackIcon from '../images/svg/feedback-icon.svg'
import externalIcon from '../images/svg/external-icon.svg'
import informationIcon from '../images/svg/information.svg'
import adviceIcon from '../images/svg/advice.svg'
import noteIcon from '../images/svg/note.svg'
import searchIcon from '../images/svg/search.svg'
import closeIcon from '../images/svg/close-icon.svg'

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
iconsMap.set('externalIcon', externalIcon)
iconsMap.set('informationIcon', informationIcon)
iconsMap.set('adviceIcon', adviceIcon)
iconsMap.set('noteIcon', noteIcon)
iconsMap.set('searchIcon', searchIcon)
iconsMap.set('closeIcon', closeIcon)

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
