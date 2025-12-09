import React from 'react'
import ReactDOM from 'react-dom/client'
// import đúng App và css từ src
import App from './src/App.jsx'
import './src/index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found in public/index.html')
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)