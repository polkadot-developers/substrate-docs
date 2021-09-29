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
    title: 'Substrate_',
    siteUrl: siteUrl,
    image: '/static/images/parity-og-image.jpeg',
    description: 'add-description',
    keywords: [
      'Blockchain',
      'Polkadot',
      'Substrate',
      'Web3.0',
      'Parity Technologies',
      'Technology',
      'Decentralization',
      'Build',
    ],
    author: 'Parity/Web3F WebDev Team',
    pressEmail: 'press@parity.io',
    email: 'info@parity.io',
    twitter: 'https://twitter.com/substrate_io',
    linkedIn: 'https://www.linkedin.com/company/paritytech',
    element: 'https://matrix.to/#/#substrate-technical:matrix.org',
    github: 'https://github.com/paritytech/substrate',
    telegram: 'https://t.me/parity_technologies',
    gitter: 'https://gitter.im/paritytech/parity',
    stackOverflow: 'https://stackoverflow.com/questions/tagged/substrate',
    privacy: 'https://www.parity.io/privacy/',
    terms: 'https://www.parity.io/terms',
    youtube: 'https://www.youtube.com/c/ParityTech',
    crowdcast: 'https://www.crowdcast.io/e/substrate-seminar-2',
    substrateIO: 'https://substrate-io-staging.netlify.app',
  },
  flags: {
    DEV_SSR: false,
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
        path: `${__dirname}/v3/tutorials/04-forkless-upgrades`,
        name: `forkless-upgrades`,
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
        path: `${__dirname}/v3/tutorials/08-ink-workshop/`,
        name: `ink-workshop`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/09-cumulus-workshop/`,
        name: `cumulus`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/10-frontier-workshop/`,
        name: `frontier`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/v3/tutorials/11-kitties-workshop/`,
        name: `kitties`,
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
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: `${__dirname}/src/images/svgs/`,
        },
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
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        mergeLinkHeaders: false,
        mergeCachingHeaders: false,
      },
    },
    `gatsby-plugin-meta-redirect`,
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
              offsetY: `100`,
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
