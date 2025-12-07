import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
Sitemap({
      hostname: 'https://retroframe.co',
      // Static public routes (lowercase with hyphens)
      dynamicRoutes: [
        '/',
        '/studio',
        '/blog',
        '/order-tracking',
        '/contact',
        '/terms',
        '/privacy',
        '/refund'
      ],
      // Exclude user/admin pages from sitemap
      exclude: [
        '/admin',
        '/admin-login',
        '/print-file',
        '/print-a4',
        '/template-manager',
        '/payment-callback',
        '/order-details',
        '/cart',
        '/checkout',
        '/confirmation',
        '/photo-editor',
        '/robots.txt',
        '/sitemap.xml'
      ],
      robots: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: ['/admin', '/print-file', '/print-a4', '/template-manager', '/payment-callback', '/order-details', '/cart', '/checkout', '/confirmation', '/photo-editor'] },
        { userAgent: 'Googlebot', allow: '/' },
        { userAgent: 'Bingbot', allow: '/' }
      ]
    })
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