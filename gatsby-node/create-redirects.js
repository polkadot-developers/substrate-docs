// This param is used when `/[tutorials, how-to-guides]/` are then redirected to
// `/[tutorials, how-to-guides]/<defaultVersion>/`.
const defaultVersion = 'v3';

const redirects = [
  {
    fromPath: '/how-to-guides/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/v3/',
    toPath: '/main-docs/',
  },
  {
    fromPath: '/v3/getting-started/',
    toPath: '/quick-start/',
  },
  {
    fromPath: '/v3/concepts/',
    toPath: '/main-docs/',
  },
  {
    fromPath: '/v3/runtime/',
    toPath: '/main-docs/fundamentals/runtime-intro/',
  },
  {
    fromPath: '/v3/integration/',
    toPath: '/reference/command-line-tools/',
  },
  {
    fromPath: '/v3/advanced/',
    toPath: '/main-docs/',
  },
  {
    fromPath: '/tutorials/v3/kitties/',
    toPath: `/tutorials/`,
  },
  {
    fromPath: '/tutorials/v3/cumulus/',
    toPath: `/tutorials/connect-other-chains/`,
  },
  {
    fromPath: '/how-to-guides/basics/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/how-to-guides/pallet-design/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/how-to-guides/weights/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/how-to-guides/testing/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/how-to-guides/storage-migrations/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/how-to-guides/consensus/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/how-to-guides/parachains/',
    toPath: `/reference/`,
  },
  {
    fromPath: '/how-to-guides/tools/',
    toPath: `/reference/`,
  },
];

const createPageRedirects = ({ actions }) => {
  const { createRedirect } = actions;

  redirects.forEach(({ fromPath, toPath }) => {
    createRedirect({
      fromPath,
      toPath,
      isPermanent: true,
      redirectInBrowser: true,
      force: true,
      statusCode: 301,
    });
  });
};

module.exports = {
  createPageRedirects,
};
