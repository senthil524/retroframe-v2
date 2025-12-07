import { useEffect } from 'react'
import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'
import { initWebVitals } from '@/lib/web-vitals'
import { Analytics } from '@vercel/analytics/react'

function App() {
  // Initialize Web Vitals monitoring on mount
  useEffect(() => {
    initWebVitals();
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Pages />
        <Toaster />
        <Analytics />
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App 