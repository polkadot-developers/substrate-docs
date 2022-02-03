import { graphql, useStaticQuery } from 'gatsby';

export const useImage = path => {
  const { allFile } = useStaticQuery(graphql`
    {
      allFile(filter: { sourceInstanceName: { eq: "media" } }) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(width: 1600, placeholder: NONE, formats: [AUTO, WEBP, AVIF])
            }
            relativePath
            name
          }
        }
      }
    }
  `);

  const [imageNode] = allFile.edges.filter(({ node }) => {
    const { relativePath } = node;
    return path.includes(relativePath);
  });

  if (imageNode) {
    const image = imageNode.node;
    return { image };
  }

  return null;
};
