import React from 'react'
// import { Link } from '../components/Link'
// import useComponentVisible from './Hooks/use-component-visible'
import GithubEditButton from './GithubEditButton'
import Icon from '../components/Icon'

interface VersionControlProps {
  version: string
  slug: string
  absolutePath: string
}
export default function VersionControl({
  version,
  absolutePath,
}: VersionControlProps) {
  // const { ref, isComponentVisible, setIsComponentVisible } =
  //   useComponentVisible(false)
  // const [pathName, setPathName] = useState('')
  // useEffect(() => {
  //   const str = location.pathname.substr(location.pathname.indexOf('v') + 2)
  //   setPathName(str)
  // })
  return (
    <div className="hidden lg:flex lg:items-center lg:justify-end">
      <div
        // onClick={() => setIsComponentVisible(!isComponentVisible)}
        className="relative flex items-center justify-end text-sm font-medium"
      >
        <Icon name="flag" className="fill-current dark:text-white" />
        <div className="pl-1">{`Version ${version}`}</div>
        {/* {isComponentVisible && (
          <div ref={ref} className="absolute top-6 right-0 w-28">
            <ul className="list-none bg-white ring-1 ring-black ring-opacity-90 rounded-md pl-2 pr-2 py-2">
              <Link to={`/v3${pathName}`}>
                <li className="text-black text-center hover:font-medium ">
                  Version 3.0
                </li>
              </Link>
              <Link to={`/v4${pathName}`}>
                <li className="text-black text-center hover:font-medium">
                  Version 4.0
                </li>
              </Link>
            </ul>
          </div>
        )} */}
      </div>
      <GithubEditButton absolutePath={absolutePath} />
    </div>
  )
}
