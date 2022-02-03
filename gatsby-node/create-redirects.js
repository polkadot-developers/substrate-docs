// This param is used when `/[tutorials, how-to-guides]/` are then redirected to
// `/[tutorials, how-to-guides]/<defaultVersion>/`.
const defaultVersion = 'v3';

const redirects = [
  // {
  //   fromPath: '/tutorials/',
  //   toPath: `/tutorials/${defaultVersion}/`,
  // },
  {
    fromPath: '/how-to-guides/',
    toPath: `/how-to-guides/${defaultVersion}/`,
  },
  {
    fromPath: '/v3/',
    toPath: '/v3/getting-started/overview/',
  },
  {
    fromPath: '/v3/getting-started/',
    toPath: '/v3/getting-started/overview/',
  },
  {
    fromPath: '/v3/concepts/',
    toPath: '/v3/concepts/runtime/',
  },
  {
    fromPath: '/v3/runtime/',
    toPath: '/v3/runtime/frame/',
  },
  {
    fromPath: '/v3/integration/',
    toPath: '/v3/integration/polkadot-js/',
  },
  {
    fromPath: '/v3/advanced/',
    toPath: '/v3/advanced/account-info/',
  },
  {
    fromPath: '/tutorials/v3/kitties/',
    toPath: `/tutorials/v3/kitties/pt1/`,
  },
  {
    fromPath: '/tutorials/v3/cumulus/',
    toPath: `/tutorials/v3/cumulus/start-relay/`,
  },
  {
    fromPath: '/how-to-guides/basics/',
    toPath: `/how-to-guides/v3/basics/pallet-integration/`,
  },
  {
    fromPath: '/how-to-guides/pallet-design/',
    toPath: `/how-to-guides/v3/pallet-design/contracts-pallet/`,
  },
  {
    fromPath: '/how-to-guides/weights/',
    toPath: `/how-to-guides/v3/weights/calculate-fees/`,
  },
  {
    fromPath: '/how-to-guides/testing/',
    toPath: `/how-to-guides/v3/testing/basics/`,
  },
  {
    fromPath: '/how-to-guides/storage-migrations/',
    toPath: `/how-to-guides/v3/storage-migrations/basics/`,
  },
  {
    fromPath: '/how-to-guides/consensus/',
    toPath: `/how-to-guides/v3/consensus/pow/`,
  },
  {
    fromPath: '/how-to-guides/parachains/',
    toPath: `/how-to-guides/v3/parachains/connect/`,
  },
  {
    fromPath: '/how-to-guides/tools/',
    toPath: `/how-to-guides/v3/tools/try-runtime/`,
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
