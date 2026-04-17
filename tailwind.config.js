/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F2E4CE',
        accent: '#B34539',
        gold: '#E8A838',
        teal: '#3A7D6B',
        'jxj-blue': '#5B8EC2',
        navy: '#162B44',
        dark: '#1A1916',
        muted: '#6B5E52',
        paper: '#F0ECE4',
        surface: '#F8F6F2',
      },
      fontFamily: {
        display: ['Clash Display', 'Helvetica Neue', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Satoshi', 'Inter', 'sans-serif'],
        names: ['Montserrat', 'Satoshi', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
