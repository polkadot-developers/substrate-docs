/* read the `.env.*` files, gatsby builtin */
// eslint-disable-next-line
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

// eslint-disable-next-line
const siteMetadata = require('./config/siteMetadata')

module.exports = {
  siteMetadata,
  flags: {
    DEV_SSR: false,
  },
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

    /* Progressive Web App + Offline functionality
       (docs: https://gatsby.dev/offline) */
    /* `gatsby-plugin-offline`, */

    /* removing registered legacy worker from gatsby-plugin-offline */
    'gatsby-plugin-remove-serviceworker',

    /* add seo headers and page titles, from pages/components */
    'gatsby-plugin-react-helmet',

    /* generate an application manifest.json */
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Substrate Documentation`,
        short_name: `Substrate Docs`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#26E0A2`,
        display: `standalone`,
        /* icon path is relative to the root of the site. */
        icon: `src/images/favicon.png`,
        // icon: `media/favicon/favicon.png`,
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

    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: `${__dirname}/src/images/svgs/`,
        },
      },
    },

    /* source file system for (cms) images/media/upload dir */
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `media`,
        path: `${__dirname}/media`,
      },
    },

    /* work with images
       - need to be after sourcing images
       - docs: https://www.gatsbyjs.com/plugins/gatsby-plugin-image */
    `gatsby-plugin-image`,
    /* transform and get data from images */
    `gatsby-plugin-sharp`,
    /* querying for images used in dynamic components */
    `gatsby-transformer-sharp`,

    /* allow to use relative path for images in markdown and frontmatter;
     used to work with netlify-cms, loaded after the media themselves */
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
        ],
      },
    },

    /* source file system for content dir */
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `./content/`,
      },
    },

    /* TODO: clean up / decommission */

    'gatsby-plugin-sitemap',
    `gatsby-plugin-meta-redirect`,
    `gatsby-plugin-twitter`,

    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        mergeLinkHeaders: false,
        mergeCachingHeaders: false,
      },
    },

    {
      resolve: `gatsby-plugin-force-trailing-slashes`,
      options: {
        excludedPaths: [`/404.html`],
      },
    },

    {
      resolve: 'gatsby-plugin-simple-analytics',
      options: {
        domain: 'api-sa.substrate.io',
        eventsGlobal: 'sa',
        events: true,
        trackPageViews: true,
      },
    },

    /*
     * legacy
     */

    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/src/pages`,
    //     name: `pages`,
    //   },
    // },
    // SOURCE FOLDERS FOR DOCUMENTATIONS
    //*********************************//
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/v3/docs`,
    //     name: `docs`,
    //   },
    // },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/v3/how-to-guides`,
    //     name: `htgs`,
    //   },
    // },
    //TUTORIALS//
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     path: `${__dirname}/v3/tutorials/`,
    //     name: `tuts`,
    //   },
    // },

    // {
    //   resolve: `gatsby-plugin-sharp`,
    //   options: {
    //     defaults: {
    //       formats: [`auto`, `webp`],
    //       quality: 100,
    //       breakpoints: [640, 768, 1024, 1280],
    //       backgroundColor: `transparent`,
    //       tracedSVGOptions: {},
    //       blurredOptions: {},
    //       jpgOptions: {},
    //       pngOptions: {},
    //       webpOptions: {},
    //       avifOptions: {},
    //     },
    //   },
    // },
    // `gatsby-remark-images`,
    // `gatsby-transformer-sharp`,
    // {
    //   resolve: `gatsby-plugin-mdx`,
    //   options: {
    //     gatsbyRemarkPlugins: [
    //       {
    //         resolve: `gatsby-remark-autolink-headers`,
    //         options: {
    //           offsetY: `100`,
    //           icon: `<svg className="fill-current text-substrateDark dark:text-white" aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
    //           maintainCase: false,
    //           removeAccents: false,
    //           isIconAfterHeader: false,
    //           elements: [`h2`, `h3`],
    //         },
    //       },
    //       {
    //         resolve: 'gatsby-remark-images',
    //         options: {
    //           maxWidth: 1200,
    //           linkImagesToOriginal: false,
    //         },
    //       },
    //     ],
    //     defaultLayouts: {
    //       default: require.resolve(`./src/components/Layout.tsx`),
    //     },
    //   },
    // },
  ],
}
