import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import App from './App'
import { StoreProvider } from './lib/store'
import './index.css'

// The single-file preview build runs inside a sandboxed frame, so it keeps routes in memory.
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <StoreProvider>
        <App />
      </StoreProvider>
    </Router>
  </StrictMode>,
)
