/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#07091A',
        panel: '#10162E',
        coral: '#FF6A55',
        neon: '#4FD6EA',
        grape: '#B07CFF',
        gold: '#FFC24B',
        mint: '#4ADE80',
      },
      fontFamily: {
        disp: ['"Avenir Next"', 'Futura', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
