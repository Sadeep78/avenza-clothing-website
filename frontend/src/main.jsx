/**
 * ====================================================================
 * AVENZA CLOTHING STORE - CLIENT APPLICATION ENTRY POINT
 * File: frontend/src/main.jsx
 * Description: Mounts the React virtual DOM tree to root DOM container.
 * ====================================================================
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
