/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        indigoNight: '#111827',
        skyMint: '#4ade80',
        dusk: '#0f172a',
        mist: '#94a3b8',
      },
      boxShadow: {
        glass: '0 20px 45px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
