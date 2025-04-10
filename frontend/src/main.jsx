import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Chatbot from './components/Chatbot.jsx'
import Dashboard from './components/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Chatbot />
    <Dashboard />
  </StrictMode>,
)
