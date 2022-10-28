import { graphql, useStaticQuery } from 'gatsby';
import { Index } from 'lunr';

const useLunrIndex = () => {
  const { LunrIndex } = useStaticQuery(
    graphql`
      {
        LunrIndex
      }
    `
  );
  const index = Index.load(LunrIndex.index);
  const { store } = LunrIndex;
  return { store, index };
};

export default useLunrIndex;
