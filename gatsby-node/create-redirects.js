// This param is used when `/[tutorials, how-to-guides]/` are then redirected to
// `/[tutorials, how-to-guides]/<defaultVersion>/`.
//const defaultVersion = 'v3';

const redirects = [
  {
    fromPath: '/playground/',
    toPath: `https://substrate.io/developers/playground/`,
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
