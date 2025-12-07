import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://retroframe.co',
      dynamicRoutes: [
        '/',
        '/Home',
        '/Studio',
        '/Blog',
        '/OrderTracking',
        '/ContactUs',
        '/Terms',
        '/Privacy',
        '/Refund'
      ],
      exclude: [
        '/Admin',
        '/AdminLogin',
        '/PrintFile',
        '/PrintA4',
        '/TemplateManager',
        '/PaymentCallback',
        '/OrderDetails',
        '/Cart',
        '/Checkout',
        '/Confirmation',
        '/PhotoEditor',
        '/Robots',
        '/Sitemap'
      ],
      robots: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: ['/Admin', '/PrintFile', '/PrintA4', '/TemplateManager', '/PaymentCallback', '/OrderDetails', '/Cart', '/Checkout', '/Confirmation'] },
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