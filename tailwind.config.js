/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Restrained dark grade — deep navy base, one quiet red accent.
        ink: '#070a12', // deep navy-black backdrop
        steel: '#0d1220',
        bone: '#eef1f6', // cool off-white
        rust: '#d8404a', // single quieter red accent
        federal: '#13305c', // muted blue (3D lighting only)
        glow: '#3b6fd4', // cooler blue used for light/glow
        chrome: '#c4ccd8',
      },
      fontFamily: {
        // One clean grotesque across the whole UI.
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      letterSpacing: {
        ultra: '0.2em',
      },
    },
  },
  plugins: [],
}
