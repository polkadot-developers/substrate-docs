import React, { Fragment } from 'react'
import data from '../../../config/docs.yaml'
import Link from '../Link'

const SubMenu = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index} className="list-none text-sm px-8  hover:font-bold">
            {Object.keys(item).map(key => {
              const url = item[`${key}`]
              const title = key

              return (
                <Fragment key={key}>
                  <Link to={url}>{title}</Link>
                </Fragment>
              )
            })}
          </li>
        )
      })}
    </ul>
  )
}

const CategoryMenu = ({ data }) => {
  const { parent, parentUrl, childMenu } = data
  const parentItem = <span className="block px-4 py-3">{parent}</span>
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
      {hasChildMenu && <SubMenu items={childMenu} />}
    </>
  )
}

const Menu = ({ data }) => {
  const { nav } = data
  return (
    <nav role="navigation">
      <ul>
        {nav.map((item, index) => {
          return (
            <li key={index}>
              <CategoryMenu data={buildParentMenu(item)} />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const DocsNavSidebar = () => {
  return <Menu data={data} />
}

export default DocsNavSidebar

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
