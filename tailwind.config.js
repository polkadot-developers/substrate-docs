/* docs.substrate.io config */

module.exports = {
  presets: [require('./tailwind-preset.js')],
  theme: {
    extend: {
      colors: {
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
        substrateDarkThemeGrey: '#3A424E',
      },
      boxShadow: {
        xxl: '0 0 25px 0 rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
