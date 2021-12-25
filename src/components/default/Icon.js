import React from 'react'

import sidebarToggle from '../../images/svg/ui/sidebar-toggle.svg'

const iconsMap = {
  /* ui */
  'sidebar-toggle': sidebarToggle,
}

export default function Icon({ name, className, ...others }) {
  if (!name) return <span className="w-5"></span>
  const IconComponent = iconsMap[`${name}`]
  if (!IconComponent) return <span className="w-5"></span>
  return (
    <IconComponent
      name={name}
      className={className}
      {...others}
    ></IconComponent>
  )
}
