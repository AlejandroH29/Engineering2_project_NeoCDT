import { createContext, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Popup } from '../components/Popup'

export const ErrorContext = createContext({
  showFriendlyError: (err) => {}
})

export const ErrorProvider = ({ children }) => {
  const [showError, setShowError] = useState(false)
  const [message, setMessage] = useState('')

  const mapErrorToFriendly = useCallback((err) => {
    // intenta mapear códigos HTTP a mensajes más amigables usando switch
    const status = err?.response?.status
    switch (true) {
      case status === 401:
        return 'Tu sesión expiró. Por favor inicia sesión de nuevo.'
      case status === 403:
        return 'No tienes permiso para realizar esta acción.'
      case status === 404:
        return 'No se encontró el recurso solicitado.'
      case typeof status === 'number' && status >= 500:
        return 'Error del servidor. Intenta de nuevo más tarde.'
      default: {
        // si la API devuelve un mensaje, úsalo
        const apiMsg = err?.response?.data?.error || err?.response?.data?.message
        if (apiMsg) return apiMsg
        // fallback a mensaje genérico o al message de JS
        return err?.message || 'Ocurrió un error. Intenta nuevamente.'
      }
    }
  }, [])

  const showFriendlyError = useCallback((err) => {
    try {
      const friendly = mapErrorToFriendly(err)
      setMessage(friendly)
      setShowError(true)
    } catch (e) {
      setMessage('Ocurrió un error.')
      setShowError(true)
    }
  }, [mapErrorToFriendly])

  useEffect(() => {
    // registrar interceptor global para respuestas con error
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        // muestra popup amigable y re-lanza el error para que el flujo normal lo maneje
        showFriendlyError(err)
        return Promise.reject(err)
      }
    )

    return () => axios.interceptors.response.eject(id)
  }, [showFriendlyError])

  return (
    <ErrorContext.Provider value={{ showFriendlyError }}>
      {children}
      {showError && (
        <Popup
          text={message}
          onClose={() => setShowError(false)}
          closeText={'Ok'}
        />
      )}
    </ErrorContext.Provider>
  )
}

export default ErrorContext
