/* eslint react/prop-types: 0 */
/* eslint react/display-name: 0  */
import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { preToCodeBlock } from 'mdx-utils'
import Code from './src/components/Code'

const components = {
  pre: (preProps: any) => {
    const props = preToCodeBlock(preProps)
    if (props) {
      return <Code {...props} />
    }
    return <pre {...preProps} />
  },
  wrapper: ({ children }: any) => <>{children}</>,
}
export const wrapRootElement = ({ element }: any) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)
