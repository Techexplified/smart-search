import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Disable modulepreload polyfill to avoid unsupported 'as' value warnings
    modulePreload: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Single chunk to avoid preload link warnings
        manualChunks: undefined
      }
    }
  },
  base: '/'
})
