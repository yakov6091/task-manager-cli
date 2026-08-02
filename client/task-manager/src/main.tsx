import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { EmailManager } from './TaskManager'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmailManager />
  </StrictMode>
)
