import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' // THÊM DÒNG NÀY
import App from './App.jsx'

// Import CSS files
import './index.css'
import './styles/globals.css'
import './styles/components.css'
import './styles/bus-ticket.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found in public/index.html')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HelmetProvider> {/* BỌC THÊM HelmetProvider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)