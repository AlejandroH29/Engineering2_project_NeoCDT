import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AppRoutes } from './routes/AppRoutes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ErrorProvider } from './context/ErrorContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <ErrorProvider>
        <AuthProvider>
          <AppRoutes/>
        </AuthProvider>
      </ErrorProvider>
    </StrictMode>
  </BrowserRouter>
)
