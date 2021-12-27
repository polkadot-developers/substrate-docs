import cx from 'classnames'

import React, { Fragment } from 'react'
import dataYaml from '../../../config/docs.yaml'
import Link from '../Link'

const SubMenu = ({ items, currentPath }) => {
  return (
    <ul className="p-0 m-0">
      {items.map((item, index) => {
        return (
          <li key={index} className="list-none text-sm m-0 font-medium">
            {Object.keys(item).map(key => {
              const url = item[`${key}`]
              const title = key
              const isActive = currentPath.includes(url)

              return (
                <Fragment key={key}>
                  <Link
                    to={url}
                    className={cx('block px-4 py-1 hover:font-bold', {
                      'font-bold': isActive,
                    })}
                  >
                    {title}
                  </Link>
                </Fragment>
              )
            })}
          </li>
        )
      })}
    </ul>
  )
}

const CollectionMenu = ({ data, currentPath }) => {
  const { parent, parentUrl, childMenu } = data
  const parentItem = <span className="inline-block py-3">{parent}</span>
  const hasChildMenu = Array.isArray(childMenu) && childMenu.length > 0

  return (
    <>
      {parentUrl ? (
        <Link to={`${parentUrl}`} className="font-bold">
          {parentItem}
        </Link>
      ) : (
        parentItem
      )}
      {hasChildMenu && <SubMenu items={childMenu} currentPath={currentPath} />}
    </>
  )
}

const Menu = ({ currentPath }) => {
  const { nav } = dataYaml
  return (
    <nav role="navigation">
      <ul className="p-0 m-0">
        {nav.map((item, index) => {
          return (
            <li key={index} className="p-0 m-0 list-none">
              <CollectionMenu
                data={buildParentMenu(item)}
                currentPath={currentPath}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const NavDocs = ({ currentPath }) => {
  return <Menu currentPath={currentPath} />
}

export default NavDocs

const buildParentMenu = parentMenu => {
  // parent object key
  const [firstKey] = Object.keys(parentMenu)
  // parent items object
  const subMenu = parentMenu[`${firstKey}`]
  // prepare menu constructor
  const data = {
    parent: firstKey,
    parentUrl: '',
    childMenu: [],
  }

  // populate child menu items if exist
  if (Array.isArray(subMenu)) {
    const parentUrl =
      typeof subMenu[0] === 'string' || subMenu[0] instanceof String
        ? subMenu[0]
        : ''

    const childMenu = subMenu.filter(function (val) {
      return typeof val === 'object' && val !== null
    })

    return Object.assign(data, { parentUrl: parentUrl }, { childMenu })
  }

  return Object.assign(data, { parentUrl: subMenu })
}
