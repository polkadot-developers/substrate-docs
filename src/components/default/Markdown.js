import React from 'react';
import rehypeReact from 'rehype-react';

import { Code } from './resolvers/Code';
import { Image } from './resolvers/Image';
import { a } from './resolvers/Link';
import { TabbedCode } from './resolvers/TabbedCode';
// import Code from '../ui/Code'

const components = {
  a,
  img: Image,
  pre: Code,
  figure: TabbedCode,
  // code: Code,
};

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components,
}).Compiler;

export default function Markdown({ htmlAst }) {
  return renderAst(htmlAst);
}
