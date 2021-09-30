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

const iconsMap = {
  /* homepage */
  docsIcon: docsIcon,
  htgIcon: htgIcon,
  tutsIcon: tutsIcon,
  gradHat: gradHat,
  calendar: calendar,
  grantsDollar: grantsDollar,
  ideCode: ideCode,
  diamondGreen: diamondGreen,
  diamondYellow: diamondYellow,
  diamondPurple: diamondPurple,
  /* playground */
  feTemplate: feTemplate,
  nodeTemplate: nodeTemplate,
  /* social-media */
  elementOrg: elementOrg,
  stackOverflowOrg: stackOverflowOrg,
  github: github,
  /* UI specific */
  arrowMore: arrowMore,
  arrowDown: arrowDown,
  flag: flag,
  docsNavIcon: docsNavIcon,
  copyText: copyText,
}

interface IconProps {
  name: string
  className?: string
}

export default function Icon({ name, className }: IconProps) {
  if (!name) return <span className="w-5"></span>
  const IconComponent = iconsMap[`${name}`]
  if (!IconComponent) return <span className="w-5"></span>
  return <IconComponent name={name} className={className}></IconComponent>
}
