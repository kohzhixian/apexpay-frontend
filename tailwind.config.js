/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3680f7',
        'background-light': '#f5f7f8',
        'background-dark': '#101722',
        // Dark theme colors
        'dark-bg': {
          primary: '#101722',
          secondary: '#1a202c',
          tertiary: '#2d3748',
          card: '#162032',
          elevated: '#1e293b',
          input: '#101723',
        },
        'dark-border': {
          DEFAULT: '#304669',
          light: '#223149',
          subtle: '#314368',
        },
        'dark-text': {
          primary: '#ffffff',
          secondary: '#8fa6cc',
          muted: '#506385',
          placeholder: '#5e7ba8',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '1rem',
        full: '9999px',
      },
      boxShadow: {
        'primary': '0 0 20px rgba(54, 128, 247, 0.2)',
        'primary-lg': '0 0 30px rgba(54, 128, 247, 0.3)',
        'blue-sm': '0 0 10px rgba(59, 130, 246, 0.2)',
        'blue-md': '0 0 20px rgba(59, 130, 246, 0.3)',
        'blue-lg': '0 0 30px rgba(59, 130, 246, 0.5)',
        'emerald': '0 0 10px rgba(16, 185, 129, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
