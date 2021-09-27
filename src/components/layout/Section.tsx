import cx from 'classnames'
import React from 'react'

interface SectionProps {
  children: React.ReactNode
  styles?: string
}

export default function Layout({ children, styles }: SectionProps) {
  const sectionClass = 'container mb-20 xl:mb-40 lg:px-10'

  return <section className={cx(sectionClass, styles)}>{children}</section>
}
