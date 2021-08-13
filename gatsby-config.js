const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://docs.substrate.io',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env
const isNetlifyProduction = NETLIFY_ENV === 'production'
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL

module.exports = {
  siteMetadata: {
    title: 'Substrate Docs',
    siteUrl: siteUrl,
    image: '/static/images/parity-og-image.jpeg',
    description: 'add-description',
    keywords: [
      'Blockchain',
      'Polkadot',
      'Substrate',
      'Web3.0',
      'Parity Technologies',
    ],
    author: 'Parity/Web3F WebDev Team',
    pressEmail: 'press@parity.io',
    email: 'info@parity.io',
    twitter: 'https://twitter.com/ParityTech',
    linkedIn: 'https://www.linkedin.com/company/paritytech',
    element: 'https://app.element.io/#/room/#watercooler:matrix.parity.io',
    github: 'https://github.com/paritytech/',
    telegram: 'https://t.me/parity_technologies',
    gitter: 'https://gitter.im/paritytech/parity',
  },
  flags: {
    DEV_SSR: false,
    PRESERVE_WEBPACK_CACHE: false,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: `pages`,
      },
    },
    // SOURCE FOLDERS FOR DOCUMENTATIONS
    //*********************************//
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/docs`,
        name: `kbV3`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/how-to-guides`,
        name: `htg`,
      },
    },
    //TUTORIALS//
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/01-create-your-first-substrate-chain`,
        name: `create-your-first-substrate-chain`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/02-proof-of-existence`,
        name: `proof-of-existence`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/03-permissioned-network`,
        name: `permissioned-network`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/04-forkless-upgrade`,
        name: `forkless-upgrade`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/05-private-network`,
        name: `private-network`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/06-node-metrics`,
        name: `node-metrics`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/07-add-a-pallet`,
        name: `add-a-pallet`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/08-ink-workshop/Part I`,
        name: `ink-workshop`,
      },
    },
    //*********************************//
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    },
    {
      resolve: 'gatsby-omni-font-loader',
      options: {
        mode: 'render-blocking',
        enableListener: false,
        preconnect: ['https://fonts.gstatic.com'],
        web: [
          {
            name: 'Karla',
            file: 'https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800',
          },
          {
            name: 'Poppins',
            file: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800',
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-twitter`,
    {
      resolve: `gatsby-theme-i18n`,
      options: {
        defaultLang: `en`,
        locales: `en`,
        configPath: require.resolve(`./i18n/config.json`),
      },
    },
    {
      resolve: `gatsby-theme-i18n-react-intl`,
      options: {
        defaultLocale: `./i18n/react-intl/en.json`,
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `tracedSVG`,
          quality: 100,
          breakpoints: [640, 768, 1024, 1280],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        },
      },
    },
    `gatsby-remark-images`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: `200`,
              icon: `<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>`,
              maintainCase: false,
              removeAccents: false,
              isIconAfterHeader: false,
              elements: [`h2`, `h3`],
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1200,
              linkImagesToOriginal: false,
            },
          },
        ],
        defaultLayouts: {
          default: require.resolve(`./src/components/Layout.tsx`),
        },
      },
    },
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        stages: ['develop'],
        options: {
          emitWarning: false,
          failOnError: false,
        },
      },
    },
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [
          require('tailwindcss'),
          require('./tailwind.config.js'),
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Substrate Documentation`,
        short_name: `Substrate Docs`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#26E0A2`,
        display: `standalone`,
        icon: `src/images/favicon.png`,
      },
    },
    'gatsby-plugin-offline',
  ],
}
