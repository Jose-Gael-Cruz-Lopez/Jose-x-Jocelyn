import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 3000,
    watch: {
      // Ignore IDE atomic-save churn that truncates these files mid-write.
      // Without this, Vite tries to reload config during the empty-file moment and dies.
      ignored: ['**/package.json', '**/.env.local', '**/vite.config.js'],
    },
  },
})
