const redirects = [
  {
    fromPath: '/',
    toPath: '/quick-start/',
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
