import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'INEFFECTIVE_DYNAMIC_IMPORT') return
        warn(warning)
      }
    }
  }
})
