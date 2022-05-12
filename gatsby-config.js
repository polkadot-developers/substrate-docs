/* read the `.env.*` files, gatsby builtin */
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

// const { isNil } = require('lodash');

// const mapPagesUrls = {
//   index: '/',
// };

const siteMetadata = require('./config/siteMetadata');

module.exports = {
  siteMetadata,
  plugins: [
    /* Custom ESLint to your Gatsby dev environment  */
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: true,
        },
      },
    },
    'gatsby-plugin-postcss',
    /* use tailwindcss, used sass instead of css */
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [
          require('tailwindcss'),
          /* Load custom Tailwind CSS configuration, used to purge
             "unused" tailwind classes */
          require('./tailwind.config.js'),
        ],
      },
    },
    /* removing registered legacy worker from gatsby-plugin-offline */
    'gatsby-plugin-remove-serviceworker',
    /* add seo headers and page titles, from pages/components */
    'gatsby-plugin-react-helmet',
    `gatsby-transformer-gitinfo`,
    /* generate an application manifest.json */
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Substrate.io`,
        short_name: `substrate.io`,
        start_url: `/`,
        background_color: `#24CC85`,
        theme_color: `#24CC85`,
        display: `minimal-ui`,
        /* icon path is relative to the root of the site. */
        icon: `src/images/favicon.png`,
      },
    },
    /* source file system for (code based) icon images (svg) */
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `icons`,
        path: `${__dirname}/src/images`,
      },
    },
    /* Adds svg-react-loader to gatsby webpack config */
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: `${__dirname}/src/images/svg/`,
        },
      },
    },
    /* source file system for (cms) images/media/upload dir */
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `media`,
        path: `${__dirname}/content/media`,
      },
    },
    {
      resolve: `gatsby-plugin-lunr`,
      options: {
        languages: [
          // {
          //   // ISO 639-1 language codes. See https://lunrjs.com/guides/language_support.html for details
          //   name: 'en',
          //   // A function for filtering nodes. () => true by default
          //   filterNodes: node => node.frontmatter.lang === 'en',
          //   // Add to index custom entries, that are not actually extracted from gatsby nodes
          //   customEntries: [{ title: 'Pictures', content: 'awesome pictures', url: '/pictures' }],
          // },
          // {
          //   name: 'fr',
          //   filterNodes: node => node.frontmatter.lang === 'fr',
          // },
        ],
        // Fields to index. If store === true value will be stored in index file.
        // Attributes for custom indexing logic. See https://lunrjs.com/docs/lunr.Builder.html for details
        fields: [
          { name: 'title', store: true, attributes: { boost: 20 } },
          { name: 'content' },
          { name: 'url', store: true },
        ],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields' values
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            content: node => node.rawMarkdownBody,
            url: node => node.fields.url,
          },
        },
        //custom index file name, default is search_index.json
        filename: 'search_index.json',
        //custom options on fetch api call for search_ındex.json
        fetchOptions: {
          credentials: 'same-origin',
        },
      },
    },
    /* work with images
       - need to be after sourcing images
       - docs: https://www.gatsbyjs.com/plugins/gatsby-plugin-image */
    `gatsby-plugin-image`,
    /* transform and get data from images */
    `gatsby-plugin-sharp`,
    /* querying for images used in dynamic components */
    {
      resolve: `gatsby-transformer-sharp`,
      options: {
        // The option defaults to true
        checkSupportedExtensions: false,
      },
    },

    /* allow to use relative path for images in markdown and frontmatter;
     used to work with netlify-cms, loaded after the media themselves */
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              elements: [`h2`, `h3`],
            },
          },
          'gatsby-remark-unwrap-images',
          /* invoke lazyload manually to fix srcset rehype parsing
          using lazysizes package (loaded in gatsby-browser.js) */
          // `gatsby-remark-lazy-load`,
          {
            resolve: `gatsby-remark-embed-snippet`,
            options: {
              directory: `${__dirname}/content/code-snippets/`,
            },
          },
          `gatsby-remark-prismjs`,
          {
            resolve: 'gatsby-remark-custom-blocks',
            options: {
              blocks: {
                info: {
                  classes: 'info',
                },
                danger: {
                  classes: 'danger',
                },
                advice: {
                  classes: 'advice',
                },
              },
            },
          },
          {
            resolve: 'gatsby-remark-component',
            /* for strict declaration (required to escape default components like <img />) */
            options: { components: ['a', 'img'] },
          },
        ],
      },
    },

    /* source file system for content dir */
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `./content/md/`,
      },
    },
    /* source the locales for gatsby-react-i18next */
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/locales`,
        name: `locale`,
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        localeJsonSourceName: `locale`, // name given to `gatsby-source-filesystem` plugin.
        languages: [`en`],
        defaultLanguage: `en`,
        // if you are using Helmet, you must include siteUrl
        siteUrl: siteMetadata.siteUrl,
        // you can pass any i18next options
        // pass following options to allow message content as a key
        i18nextOptions: {
          fallbackLng: 'en',
          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
          keySeparator: false,
          nsSeparator: false,
        },
      },
    },
    {
      resolve: `gatsby-plugin-breadcrumb`,
      options: {
        // useAutoGen: required 'true' to use autogen
        useAutoGen: true,
        // autoGenHomeLabel: optional 'Home' is default
        autoGenHomeLabel: `Home`,
        // exclude: optional, include this array to exclude paths you don't want to
        // generate breadcrumbs for (see below for details).
        exclude: [`**/dev-404-page/**`, `**/404/**`, `**/404.html`, `**/offline-plugin-app-shell-fallback/**`],
        // crumbLabelUpdates: optional, update specific crumbLabels in the path
        crumbLabelUpdates: [],
      },
    },
    'gatsby-plugin-sitemap',
    // {
    //   resolve: 'gatsby-plugin-simple-analytics',
    //   options: {
    //     domain: 'api-sa.substrate.io',
    //     eventsGlobal: 'sa',
    //     events: true,
    //     trackPageViews: true,
    //   },
    // },
    {
      resolve: `gatsby-plugin-force-trailing-slashes`,
      options: {
        excludedPaths: [`/404.html`],
      },
    },
  ],
};
