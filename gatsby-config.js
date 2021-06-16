require(`dotenv`).config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    siteUrl: `https://gatsby-theme-i18n.netlify.app`,
    title: "gatsby-theme-i18n",
    description: `Default example for i18n`,
    author: `LekoArts`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: `pages`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/blog`,
        name: `blog`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-theme-i18n`,
      options: {
        defaultLang: `en`,
        locales: process.env.LOCALES,
        configPath: require.resolve(`./i18n/config.json`),
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: require.resolve(`./src/components/layout.js`),
        },
      },
    },
  ],
}
