import React from 'react';
import Children from 'react-children-utilities';
import { TabPanel, useTabs } from 'react-headless-tabs';

import { Code } from './Code';
import { TabSelector } from './TabSelector';

function TabbedCode({ children, className }) {
  const onlyDivs = Children.filter(children, child => child.type === 'div');
  //console.log(onlyDivs);
  if (className && className.includes('tabbed')) {
    const langArray = [];
    onlyDivs.map(div => {
      langArray.push(div.props.children[0].props.children[0].props.children[0].props.className);
    });
    const [selectedTab, setSelectedTab] = useTabs(langArray);
    return (
      <>
        <nav className="flex border-b border-gray-300">
          {onlyDivs.map(div => {
            const languageName = div.props.children[0].props.children[0].props.children[0].props.className
              .split('-')
              .pop();

            return (
              <TabSelector
                key={div.props.children[0].props.children[0].props.children[0].id}
                isActive={selectedTab === div.props.children[0].props.children[0].props.children[0].props.className}
                onClick={() =>
                  setSelectedTab(div.props.children[0].props.children[0].props.children[0].props.className)
                }
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
              className={`gatsby-highlight ${div.props.children[0].props.children[0].props.className}`}
              hidden={selectedTab !== div.props.children[0].props.children[0].props.children[0].props.className}
            >
              <Code className={div.props.children[0].props.children[0].props.children[0].props.className}>
                {div.props.children[0].props.children[0].props.children[0].props.children}
              </Code>
            </TabPanel>
          );
        })}
      </>
    );
  } else return <figure className={className}>{children}</figure>;
}

export { TabbedCode };
