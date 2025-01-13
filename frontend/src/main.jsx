// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ResourceProvider } from './context/ResourceContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResourceProvider>
      <App />
    </ResourceProvider>
  </React.StrictMode>,
)