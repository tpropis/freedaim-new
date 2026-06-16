import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// freedaim — cinematic scroll/3D front end
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // Split the heavy WebGL stack out of the main bundle so the hero
    // can become interactive while three/drei stream in.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
