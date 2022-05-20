import React from 'react';
import Children from 'react-children-utilities';
import { TabPanel, useTabs } from 'react-headless-tabs';

import { Code } from './Code';
import { TabSelector } from './TabSelector';

function TabbedCode({ children, className }) {
  const onlyDivs = Children.filter(children, child => child.type === 'code');
  //console.log(tabNames);
  //const OnlyValid = ({ children }) => <div>{onlyValid(children)}</div>;
  const [selectedTab, setSelectedTab] = useTabs([
    'language-bash',
    'language-javascript',
    'language-rust',
    'language-c',
  ]);
  console.log(onlyDivs);
  if (className && className.includes('tabbed-code')) {
    return (
      <>
        <nav className="flex border-b border-gray-300">
          {onlyDivs.map(div => {
            const languageName = div.props.className.split('-').pop();
            return (
              <TabSelector
                key={div.id}
                isActive={selectedTab === div.props.className}
                onClick={() => setSelectedTab(div.props.className)}
              >
                {languageName.charAt(0).toUpperCase() + languageName.slice(1)}
              </TabSelector>
            );
          })}
        </nav>
        {onlyDivs.map(div => {
          return (
            <TabPanel
              key={div.key}
              className={`gatsby-highlight ${div.props.className}`}
              hidden={selectedTab !== div.props.className}
            >
              <Code className={div.props.className} data-language={div.props.className}>
                {div.props.children}
              </Code>
            </TabPanel>
          );
        })}
      </>
    );
  } else return <code className={className}>{children}</code>;
}

export { TabbedCode };
