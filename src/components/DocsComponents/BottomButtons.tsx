import React, { useState, useEffect } from 'react'
import { PreviousButton, NextButton } from '../DocsComponents'

interface BottomButtonsProps {
  menu: { name: string; items: { title: string; link: string }[] }[]
  pageSlug: string
}
interface buttonProps {
  title: string
  link: string
}

export function BottomButtons({ menu, pageSlug }: BottomButtonsProps) {
  const [nextButton, setNextButton] = useState<buttonProps | null>({
    title: '',
    link: '',
  })
  const [prevButton, setPrevButton] = useState<buttonProps | null>({
    title: '',
    link: '',
  })
  useEffect(() => {
    const pages: { title: string; link: string }[] = []
    menu.forEach(menuItems => {
      menuItems.items.forEach(item => {
        if (item.link.indexOf('#') != 0) {
          pages.push(item)
        }
      })
    })
    pages.map((each, index) => {
      if (each.link === pageSlug) {
        if (index === 0) {
          setNextButton(pages[index + 1])
          setPrevButton(null)
        } else if (index === pages.length - 1) {
          setPrevButton(pages[index - 1])
          setNextButton(null)
        } else {
          setNextButton(pages[index + 1])
          setPrevButton(pages[index - 1])
        }
      }
    })
  }, [])

  return (
    <div
      className={`flex flex-col items-center lg:flex-row ${
        prevButton === null ? 'lg:justify-end' : 'lg:justify-between'
      }`}
    >
      {prevButton === null ? null : (
        <PreviousButton text={prevButton.title} link={prevButton.link} />
      )}
      {nextButton === null ? null : (
        <NextButton text={nextButton.title} link={nextButton.link} />
      )}
    </div>
  )
}
