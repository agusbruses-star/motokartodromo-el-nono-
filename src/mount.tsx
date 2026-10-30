import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

export function mount(node: React.ReactNode) {
  ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>{node}</React.StrictMode>)
}
