/* docs.substrate.io config */

module.exports = {
  presets: [require('./tailwind-preset.js')],
  theme: {
    extend: {
      colors: {
        mdxYellow: '#FFEED6',
        mdxGreen: '#D6FACA',
        mdxRed: '#FFE1D9',
        mdxYellow: {
          DEFAULT: '#FFEED6',
          dark: '#EEF300',
        },
        mdxGreen: {
          DEFAULT: '#D6FACA',
          dark: '#D4F9EC',
        },
        mdxRed: {
          DEFAULT: '#FFE1D9',
          dark: '#F2606A',
        },
        mdxLightBg: '#FAFBFC',
      },
    },
  },
  plugins: [],
}
