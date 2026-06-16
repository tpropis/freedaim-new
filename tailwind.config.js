/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Tuned American grade — not flag-primary, cinematic.
        ink: '#050814', // deep navy-black backdrop
        steel: '#0a1024',
        bone: '#f3efe4', // warm off-white
        rust: '#c8102e', // controlled Old-Glory red accent
        federal: '#0a3161', // Old-Glory blue
        glow: '#3b6fd4', // cooler blue used for light/glow
        chrome: '#cdd3dd',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.42em',
      },
    },
  },
  plugins: [],
}
