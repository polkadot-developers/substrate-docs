import React from 'react';

import Card from './Card';

export default function CardsList({ data }) {
  return (
    <div className="flex flex-wrap justify-start xl:w-[1148px]">
      {data
        .sort((a, b) => {
          return a.node.frontmatter.order - b.node.frontmatter.order;
        })
        .map(({ node }) => {
          const {
            title,
            description,
            image,
            link,
            linkSAEvent,
            bodyLinkOneURL,
            bodyLinkOneSAEvent,
            bodyLinkOneTitle,
            bodyLinkTwoURL,
            bodyLinkTwoSAEvent,
            bodyLinkTwoTitle,
            bodyLinkThreeURL,
            bodyLinkThreeSAEvent,
            bodyLinkThreeTitle,
          } = node.frontmatter;
          return (
            <div key={node.id}>
              <Card
                title={title}
                text={description}
                image={image}
                link={link}
                linkSAEvent={linkSAEvent}
                bodyLinkOneURL={bodyLinkOneURL}
                bodyLinkOneSAEvent={bodyLinkOneSAEvent}
                bodyLinkOneTitle={bodyLinkOneTitle}
                bodyLinkTwoURL={bodyLinkTwoURL}
                bodyLinkTwoSAEvent={bodyLinkTwoSAEvent}
                bodyLinkTwoTitle={bodyLinkTwoTitle}
                bodyLinkThreeURL={bodyLinkThreeURL}
                bodyLinkThreeSAEvent={bodyLinkThreeSAEvent}
                bodyLinkThreeTitle={bodyLinkThreeTitle}
              />
            </div>
          );
        })}
    </div>
  );
}
