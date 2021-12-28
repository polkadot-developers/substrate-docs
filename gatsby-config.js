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

    /* source file system for (cms) images/media/upload dir */
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `media`,
        path: `${__dirname}/media`,
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
          include: `${__dirname}/src/images/svg`,
        },
      },
    },

    /* work with images
       - need to be after sourcing images
       - docs: https://www.gatsbyjs.com/plugins/gatsby-plugin-image */
    `gatsby-plugin-image`,
    /* transform and get data from images */
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `none`,
          backgroundColor: `transparent`,
          quality: 100,
        },
      },
    },
    /* querying for images used in dynamic components */
    `gatsby-transformer-sharp`,

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
          // {
          //   resolve: `gatsby-remark-relative-source`,
          //   options: {
          //     name: `media`,
          //     // htmlSources: [{ tagName: `img`, attributes: [`src`] }],
          //   },
          // },
          'gatsby-remark-unwrap-images',
          {
            resolve: `gatsby-remark-figure-caption`,
            options: {
              figureClassName: 'md-figure',
              imageClassName: '',
              captionClassName: '',
            },
          },
          // {
          //   resolve: `gatsby-remark-images`,
          //   options: {
          //     maxWidth: 1600,
          //     linkImagesToOriginal: false,
          //     quality: 100,
          //     disableBgImage: true,
          //   },
          // },
          /* invoke lazyload manually to fix srcset rehype parsing
          using lazysizes package (loaded in gatsby-browser.js) */
          // `gatsby-remark-lazy-load`,
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
  ],
}
