import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// Note: Sitemap and robots.txt are generated dynamically via React components
// /sitemap.xml - static pages
// /blog-sitemap.xml - blog posts from database
// /robots.txt - robots file with both sitemaps
export default defineConfig({
  base: '/',
  plugins: [
    react()
  ],
  server: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) 