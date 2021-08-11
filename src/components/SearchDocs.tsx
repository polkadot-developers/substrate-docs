import React, { useState } from 'react'

export default function SearchDocs() {
  const [isVisible, setIsVisible] = useState(false)
  const [section, setSection] = useState({
    docs: true,
    tuts: true,
    htgs: true,
  })
  console.log('Current Cat is: ', section)
  const toggleModal = () => {
    setIsVisible(!isVisible)
  }
  return (
    <>
      <div
        onClick={() => toggleModal()}
        className="flex items-center justify-between p-2 border-b-2 border-substrateGray cursor-pointer active:outline-none focus:outline-none"
      >
        <p className="mb-0 pr-4 text-sm text-substrateDark text-opacity-25">
          Search Documentation
        </p>
        <svg
          className="h-4 w-4 fill-current text-substrateDark"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 56.966 56.966"
          width="512px"
          height="512px"
        >
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </div>
      {isVisible ? (
        <>
          <div
            id="content-container"
            className="flex justify-center items-center fixed inset-0 z-50 px-6"
          >
            <div className="bg-white w-full max-w-screen-sm h-search p-6 rounded-lg border-2 border-substrateDark shadow-lg">
              <div className="flex justify-between mb-6">
                <div className="flex items-center justify-between w-5/6 pb-0.5 border-b-2 border-substrateGray">
                  <svg
                    className="h-4 w-4 fill-current text-substrateDark"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 56.966 56.966"
                    width="512px"
                    height="512px"
                  >
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                  <input
                    className="form-input w-full pl-4 text-lg border-none focus:ring-0"
                    type="text"
                    placeholder="Search Documentation"
                  />
                </div>
                <div
                  onClick={() => toggleModal()}
                  className="flex items-center justify-center p-1 mb-2 rounded h-8 w-8 bg-substrateGray-light"
                >
                  <svg
                    className="fill-current text-substrateDark dark:text-white cursor-pointer"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.9929 3.02143C19.5491 2.4652 19.5491 1.56337 18.9929 1.00714C18.4366 0.450913 17.5348 0.450913 16.9786 1.00714L10 7.98571L3.02143 1.00714C2.4652 0.450912 1.56337 0.450913 1.00714 1.00714C0.450913 1.56337 0.450913 2.4652 1.00714 3.02143L7.98571 10L1.00714 16.9786C0.450912 17.5348 0.450913 18.4366 1.00714 18.9929C1.56337 19.5491 2.4652 19.5491 3.02143 18.9929L10 12.0143L16.9786 18.9929C17.5348 19.5491 18.4366 19.5491 18.9929 18.9929C19.5491 18.4366 19.5491 17.5348 18.9929 16.9786L12.0143 10L18.9929 3.02143Z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row mb-6">
                <label className="inline-flex items-center">
                  <input
                    className="h-4 w-4 rounded bg-white text-substrateDark border-2 focus:ring-0"
                    type="checkbox"
                    defaultChecked={section.docs}
                    onClick={() =>
                      setSection(prevState => ({
                        ...prevState,
                        docs: !section.docs,
                      }))
                    }
                  />
                  <span className="text-base font-semibold pl-2">Docs</span>
                </label>
                <label className="inline-flex items-center sm:pl-14">
                  <input
                    className="h-4 w-4 rounded bg-white text-substrateDark border-2 focus:ring-0"
                    type="checkbox"
                    defaultChecked={section.tuts}
                    onClick={() =>
                      setSection(prevState => ({
                        ...prevState,
                        tuts: !section.tuts,
                      }))
                    }
                  />{' '}
                  <span className="text-base font-semibold pl-2">
                    Tutorials
                  </span>
                </label>
                <label className="inline-flex items-center sm:pl-14">
                  <input
                    className="h-4 w-4 rounded bg-white text-substrateDark border-2 focus:ring-0"
                    type="checkbox"
                    defaultChecked={section.htgs}
                    onClick={() =>
                      setSection(prevState => ({
                        ...prevState,
                        htgs: !section.htgs,
                      }))
                    }
                  />{' '}
                  <span className="text-base font-semibold pl-2">
                    How-to Guides
                  </span>
                </label>
              </div>

              <div className="">
                <div className="text-sm font-bold mb-3">141 RESULTS</div>
                <div className="h-80 overflow-y-auto overscroll-contain">
                  <div className="group px-4 py-3 mb-2 bg-substrateGray hover:bg-substrateGreen rounded">
                    <span className="text-xs group-hover:font-bold group-hover:text-white">
                      Docs
                    </span>
                    <p className="mb-0 group-hover:font-bold group-hover:text-white">
                      Runtime Storage
                    </p>
                  </div>
                  <div className="group px-4 py-3 mb-2 bg-substrateGray hover:bg-substrateGreen rounded">
                    <span className="text-xs group-hover:font-bold group-hover:text-white">
                      Docs
                    </span>
                    <p className="mb-0 group-hover:font-bold group-hover:text-white">
                      Private Network - Create a Custom Chain Spec
                    </p>
                  </div>
                  <div className="group px-4 py-3 mb-2 bg-substrateGray hover:bg-substrateGreen rounded">
                    <span className="text-xs group-hover:font-bold group-hover:text-white">
                      How-to Guides
                    </span>
                    <p className="mb-0 group-hover:font-bold group-hover:text-white">
                      Private Network - Blockchain Solution
                    </p>
                  </div>
                  <div className="group px-4 py-3 mb-2 bg-substrateGray hover:bg-substrateGreen rounded">
                    <span className="text-xs group-hover:font-bold group-hover:text-white">
                      Docs
                    </span>
                    <p className="mb-0 group-hover:font-bold group-hover:text-white">
                      Runtime Storage
                    </p>
                  </div>
                  <div className="group px-4 py-3 mb-2 bg-substrateGray hover:bg-substrateGreen rounded">
                    <span className="text-xs group-hover:font-bold group-hover:text-white">
                      Docs
                    </span>
                    <p className="mb-0 group-hover:font-bold group-hover:text-white">
                      Private Network - Create a Custom Chain Spec
                    </p>
                  </div>
                  <div className="group px-4 py-3 mb-2 bg-substrateGray hover:bg-substrateGreen rounded">
                    <span className="text-xs group-hover:font-bold group-hover:text-white">
                      How-to Guides
                    </span>
                    <p className="mb-0 group-hover:font-bold group-hover:text-white">
                      Private Network - Blockchain Solution
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="modal-background"
            className="opacity-25 fixed inset-0 z-40 bg-substrateDark"
            onClick={() => console.log('OMG CLICK!')}
          ></div>
        </>
      ) : null}
    </>
  )
}
