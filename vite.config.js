import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    disabled: true, // Disable pre-bundling completely
  },
  server: {
    hmr: {
      overlay: false, // Disable the error overlay for now
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        silenceDeprecations: ['legacy-js-api', 'global-builtin', 'slash-div'],
      },
    },
  },
})