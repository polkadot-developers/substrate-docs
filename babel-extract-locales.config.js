/*
   Used by `yarn extract-locales`, to generate json files ready to be translated
   Docs: https://github.com/microapps/gatsby-plugin-react-i18next#how-to-extract-translations-from-pages
*/

module.exports = {
  presets: ['babel-preset-gatsby'],
  plugins: [
    [
      'i18next-extract',
      {
        keySeparator: null,
        nsSeparator: null,
        keyAsDefaultValue: ['en'],
        useI18nextDefaultValue: ['en'],
        discardOldKeys: true,
        outputPath: 'locales-tmp/{{locale}}/{{ns}}.json',
        customTransComponents: [['gatsby-plugin-react-i18next', 'Trans']],
      },
    ],
  ],
  overrides: [
    {
      test: [`**/*.ts`, `**/*.tsx`],
      plugins: [[`@babel/plugin-transform-typescript`, { isTSX: true }]],
    },
  ],
};
