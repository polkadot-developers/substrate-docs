import React from 'react';
import rehypeReact from 'rehype-react';

import { Code } from './resolvers/Code';
import { Image } from './resolvers/Image';
import { a } from './resolvers/Link';
// import Code from '../ui/Code'

const components = {
  a,
  img: Image,
  pre: Code,
  // code: Code,
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components,
}).Compiler;

export default function Markdown({ htmlAst }) {
  return renderAst(htmlAst);
}
