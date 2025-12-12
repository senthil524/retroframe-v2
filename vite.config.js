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
      dynamicRoutes: [
        '/',
        '/studio',
        '/blog',
        '/blog/ultimate-guide-polaroid-prints-india',
        '/blog/creative-ways-display-polaroid-photos',
        '/blog/choosing-perfect-photos-polaroid-prints',
        '/order-tracking',
        '/contact',
        '/terms',
        '/privacy',
        '/refund'
      ],
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
        '/photo-editor'
      ],
      robots: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: ['/admin', '/admin-login', '/print-file', '/print-a4', '/template-manager', '/payment-callback', '/order-details', '/cart', '/checkout', '/confirmation', '/photo-editor'] },
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-pdf': ['jspdf', 'html2canvas']
        }
      }
    }
  }
})
