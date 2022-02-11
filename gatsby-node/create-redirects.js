// eslint-disable-next-line @typescript-eslint/no-var-requires
const { redirects } = require('../config/redirects.js')

const createPageRedirects = ({ actions }) => {
  const { createRedirect } = actions

  redirects.forEach(({ fromPath, toPath }) => {
    createRedirect({
      fromPath,
      toPath,
      isPermanent: true,
      redirectInBrowser: true,
      force: true,
      statusCode: 301,
    })
  })
}

module.exports = {
  createPageRedirects,
}
