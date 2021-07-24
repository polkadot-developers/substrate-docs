module.exports = {
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  purge: ['./src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
  theme: {
    container: {
      center: true,
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    letterSpacing: {
      tightest: '-.075em',
      tighter: '-.05em',
      tight: '-.025em',
      normal: '0',
      wide: '.025em',
      wider: '.05em',
      widest: '.25em',
      nav: '.15em',
    },
    extend: {
      colors: {
        substrateGreen: {
          light: '#D4F9EC',
          DEFAULT: '#24CC85',
        },
        substrateGray: {
          light: '#FBFBFB',
          DEFAULT: '#F2F2F2',
        },
        substratePurple: '#5A30B4',
        substrateYellow: '#FDAB3D',
        substrateDark: '#242A35',
        substrateBlue: '#4E73F2',
        substrateBlueBg: '#EEF1FE',
        mdxYellow: '#FFEED6',
        mdxGreen: '#D6FACA',
        mdxRed: '#FFE1D9',
        mdxLightBg: '#FAFBFC',
        bgDark: '#20292A',
        lightGray: '#FAFAFA',
        parityPink: '#FF1864',
        parityRed: '#CC1350',
        parityGray: '#eff1f0',
        parityBlack: '#111',
        parityWhite: '#F1F3F2',
        parityBorder: '#3c3c3c',
        buttonRed: '#ff0048',
        textDark: '#282828',
        textLight: '#757575',
        navItemColor: '#b4b5b1',
        footerDark: '#1b1b1b',
        footerLight: '#282828',
        twitter: '#00aced',
      },
      height: {
        docNav: '90vh',
        hero: '70vh',
        googleForm: '1500px',
      },
      minHeight: {
        hero: '70vh',
        heroMin: '500px',
        heroMinLg: '700px',
      },
      spacing: {
        84: '22rem',
      },
      fontFamily: {
        body: ['Karla', 'sans-serif'],
        quote: ['serif'],
      },
      transitionProperty: {
        height: 'height',
        width: 'width',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(500px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'fade-out-left': {
          '0%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(500px)',
          },
        },
        'fade-out-down': {
          from: {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-out-up': {
          from: {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          to: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in-right': 'fade-in-right 0.3s ease-out',
        'fade-out-left': 'fade-out-left 0.3s ease-out',
        'fade-out-down': 'fade-out-down 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-out-up': 'fade-out-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-slow': 'fade-in 2s ease-in',
      },
    },
  },
  variants: ['responsive', 'group-hover', 'hover', 'focus', 'active'],
  plugins: [],
}
