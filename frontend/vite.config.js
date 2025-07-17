import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // important
  build: {
    outDir: '../backend/client', // le build ira dans le backend
    emptyOutDir: true,
  },
})
