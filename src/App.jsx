import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '@/contexts/AuthContext'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Pages />
        <Toaster />
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App 