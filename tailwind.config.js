/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nature': {
          50: '#f0f9f1',
          100: '#dcf1de',
          200: '#bbdfbe',
          300: '#90c595',
          400: '#65a66d',
          500: '#48894f',
          600: '#376c3d',
          700: '#2f5733',
          800: '#28452b',
          900: '#223a25',
        },
        'sky': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7cd1fd',
          400: '#36baf9',
          500: '#0c9eeb',
          600: '#0280c8',
          700: '#0166a2',
          800: '#065586',
          900: '#0b476f',
        },
        'sand': {
          50: '#fbf9f2',
          100: '#f6f0e0',
          200: '#ede0c2',
          300: '#e2ca9b',
          400: '#d4ad70',
          500: '#c89250',
          600: '#b87841',
          700: '#9a5f37',
          800: '#7e4d31',
          900: '#67402b',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['DM Serif Display', 'ui-serif', 'Georgia'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'glass': '4px',
      }
    },
  },
  plugins: [],
} 