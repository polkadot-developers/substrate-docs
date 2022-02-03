module.exports = {
  arrowParens: 'avoid',
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  overrides: [
    {
      files: '*.md',
      options: {
        singleQuote: false,
      },
    },
  ],
};
