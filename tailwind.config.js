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
        substrateGray: {
          darkest: '#21232d',
        },
        substrateGreen: {
          light: '#D4F9EC',
          light2: '#AEF3DC',
          dark: '#22B577',
        },
        substrateBlackish: '#242A35',
        substrateDarkest: '#181A22',
        substrateDarkThemeLightGrey: '#F8FAF9',
        substrateSubtleGrey: '#E0E0E0',
        substrateDarkThemeBlue: '#0094FF',
        polkaPink: '#E6007A',
        transparentWhite: 'rgba(255, 255, 255, 0.1)',
        transparentDarkest: 'rgba(24, 26, 34, 0.1)',
      },
      boxShadow: {
        xxl: '0 0 25px 0 rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      minHeight: {
        238: '238px',
      },
    },
  },
  plugins: [],
}
