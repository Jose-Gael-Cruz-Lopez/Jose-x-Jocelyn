import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    port: 3000,
    watch: {
      // macOS IDEs (Cursor / VS Code) write files atomically — they briefly
      // truncate the file to 0 bytes before writing the new content. Vite's
      // file watcher (chokidar) fires events during that empty window, which
      // makes HMR think modules suddenly lost their exports. Result: white
      // screen with "does not provide an export named 'default'."
      //
      // awaitWriteFinish: only treat a file as "changed" once its size has
      // been stable for stabilityThreshold ms. Filters out the atomic-save
      // mid-write moment entirely.
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 50,
      },
      // Ignore IDE autosave churn on these files entirely — even with
      // awaitWriteFinish, restart-triggering files are best left untouched.
      ignored: ['**/package.json', '**/.env.local', '**/vite.config.js'],
    },
  },
  // Pre-bundle these so HMR doesn't lazily re-discover them mid-edit and
  // briefly drop them from the module graph. Pre-bundled deps stay stable
  // through reload cycles.
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'gsap',
      'gsap/ScrollTrigger',
      '@supabase/supabase-js',
    ],
  },
})
