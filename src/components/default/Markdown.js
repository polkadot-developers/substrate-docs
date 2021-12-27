import React from 'react'
import rehypeReact from 'rehype-react'

import { Link } from './resolvers/Link'

const components = {
  a: Link,
}

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components,
}).Compiler

export default function Markdown({ htmlAst }) {
  return renderAst(htmlAst)
}
