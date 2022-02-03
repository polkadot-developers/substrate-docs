/* substrate-docs config */

module.exports = {
  presets: [require('./tailwind-preset.js')],
  theme: {
    fontFamily: {
      sans: ['Karla', 'sans-serif'],
      title: ['Poppins', 'sans-serif'],
      quote: ['serif'],
    },
    fontWeight: {
      hairline: 100,
      extralight: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    letterSpacing: {
      wider: '.25em',
      widest: '.45em',
    },
    extend: {
      screens: {
        '2xl': '1400px',
      },
      colors: {
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
        substrateDarkThemeGrey: '#3A424E',
        substrateDarkThemeLightGrey: '#F8FAF9',
        substrateSubtleGrey: '#E0E0E0',
        substrateDarkThemeBlue: '#0094FF',
        polkaPink: '#E6007A',
        transparentWhite: 'rgba(255, 255, 255, 0.1)',
        transparentDarkest: 'rgba(24, 26, 34, 0.1)',
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
      fontSize: {
        '2.5xl': ['1.75rem', { lineHeight: '1.2' }],
        '7xl': ['5rem', { lineHeight: '1' }],
        'four-oh-four': ['20rem', { lineHeight: '1' }],
      },
      boxShadow: {
        xxl: '0 0 25px 0 rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      zIndex: {
        '-10': -10,
      },
    },
    gridTemplateRows: {
      1: 'repeat(1, minmax(0, 1fr))',
      7: 'repeat(7, minmax(0, 1fr))',
    },
    boxShadow: {
      md: '0 0 15px 0 rgba(0, 0, 0, 0.05), 0 5px 5px -5px rgba(0, 0, 0, 0.04)',
      xl: '0 0 25px 0 rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
  plugins: [],
};
