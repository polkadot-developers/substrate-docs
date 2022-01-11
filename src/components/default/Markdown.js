import React from 'react'
import rehypeReact from 'rehype-react'

import { a } from './resolvers/Link'
import { Image } from './resolvers/Image'
// import Code from '../ui/Code'

const components = {
  a,
  img: Image,
  // code: Code,
}

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components,
}).Compiler

export default function Markdown({ htmlAst }) {
  return renderAst(htmlAst)
}
