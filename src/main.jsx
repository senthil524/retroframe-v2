import React from 'react'
import ReactDOM from 'react-dom/client'
import { clarity } from '@microsoft/clarity'
import App from '@/App.jsx'
import '@/index.css'

// Initialize Microsoft Clarity
clarity.init('uitxn00tuy')

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 