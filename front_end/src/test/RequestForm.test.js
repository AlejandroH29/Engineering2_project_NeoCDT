import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { RequestForm } from '../pages/RequestForm'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue([new URLSearchParams()]),
}))

// Mock de axios para controlar respuestas en tests que usan llamadas HTTP
jest.mock('axios')

// Limpiar mocks antes de cada test para evitar interferencias
beforeEach(() => {
  jest.clearAllMocks()
  // restaurar search params vacíos por defecto
  const rr = require('react-router-dom')
  if (rr.useSearchParams && rr.useSearchParams.mockReturnValue) rr.useSearchParams.mockReturnValue([new URLSearchParams()])
  // Evitar error de jsdom: requestSubmit no implementado cuando se hace click en botones tipo submit
  if (typeof HTMLFormElement !== 'undefined' && !HTMLFormElement.prototype.requestSubmit) {
    HTMLFormElement.prototype.requestSubmit = function () {}
  }
  // Silenciar console.error en tests para evitar trazas ruidosas (sobre todo cuando simulamos errores)
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  // Restaurar console.error si fue espiado
  if (console.error && console.error.mockRestore) console.error.mockRestore()
})

test('renderiza RequestForm', () => {
  //Renderizamos el componente sólo con el AuthContext Provider 
  render(
    //Evita que useContext(AuthContext) devuelva undefined
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}>
    <RequestForm />
    </AuthContext.Provider>
  )

  //Assert: el título principal 'NeoCDT' debe estar presente
  expect(screen.getByText('NeoCDT')).toBeInTheDocument()
})
 
test('muestra alerta cuando monto es menor al mínimo', () => {
  // renderizamos el componente
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )
  //obtenemos el input de monto por su placeholder
  const montoInput = screen.getByPlaceholderText("Ingresa el monto inicial (ej. 1'000,000)")
  //simulamos que el usuario ingresa un monto pequeño (500000)
  fireEvent.change(montoInput, { target: { value: '500000' } })
  //comprobamos que aparece el mensaje de alerta en el DOM
  expect(screen.getByText("El monto debe ser de al menos 1'000.000")).toBeInTheDocument()
})

// Prueba adicional: no muestra alerta cuando el monto es igual o mayor al mínimo
test('no muestra alerta cuando monto es mayor o igual al mínimo', () => {
  // Renderizamos el componente con AuthContext
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )

  // Obtener input del monto
  const montoInput = screen.getByPlaceholderText("Ingresa el monto inicial (ej. 1'000,000)")

  // Simular ingreso de monto válido (1.500.000)
  fireEvent.change(montoInput, { target: { value: '1500000' } })

  // El mensaje de alerta no debe estar presente
  expect(screen.queryByText("El monto debe ser de al menos 1'000.000")).toBeNull()
})

// Prueba adicional: muestra popup cuando se intenta enviar sin monto
test('muestra popup de campo vacío al intentar enviar sin monto', () => {
  // Renderizamos el componente
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )

  // Obtener botón Enviar por su texto
  const enviarBtn = screen.getByText('Enviar')

  // Click en Enviar sin haber rellenado el monto
  fireEvent.click(enviarBtn)

  // Debe aparecer el popup que indica que el campo debe estar lleno
  expect(screen.getByText('El campo debe estar lleno')).toBeInTheDocument()
})

// Prueba adicional: el select de plazo tiene 3 meses por defecto
test('el select de plazo tiene 3 meses por defecto', () => {
  // Renderizamos el componente
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )

  // Obtener el select por su rol (combobox) ya que la etiqueta no está ligada con id
  const select = screen.getByRole('combobox')

  // Comprobamos el valor por defecto
  expect(select.value).toBe('3')
})

// Prueba adicional: botones Enviar, Borrador y Cancelar están presentes
test('muestra los botones Enviar, Borrador y Cancelar', () => {
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )

  // Verificamos que los tres botones estén en el documento
  expect(screen.getByText('Enviar')).toBeInTheDocument()
  expect(screen.getByText('Borrador')).toBeInTheDocument()
  expect(screen.getByText('Cancelar')).toBeInTheDocument()
})

// Prueba: al escribir caracteres no numéricos en el monto, se eliminan
test('limpia caracteres no numéricos en monto al escribir', () => {
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )

  // Obtener input del monto
  const montoInput = screen.getByPlaceholderText("Ingresa el monto inicial (ej. 1'000,000)")

  // Simular ingreso con letras y signos (debe quedar solo dígitos)
  fireEvent.change(montoInput, { target: { value: "1a,000.50" } })

  // Esperamos que los caracteres no numéricos hayan sido eliminados (quedan '100050')
  expect(montoInput.value).toBe('100050')
})

// Prueba: cambiar el select de plazo actualiza su valor
test('cambiar plazo actualiza select', () => {
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )

  // Obtener el select por su rol
  const select = screen.getByRole('combobox')

  // Cambiar a 12 meses
  fireEvent.change(select, { target: { name: 'tiempo', value: '12' } })

  // Verificar que el valor cambió
  expect(select.value).toBe('12')
})

// Prueba: intentar guardar como borrador sin numeroIdentificacion muestra error de usuario no autenticado
test('borrador sin numeroIdentificacion muestra error no autenticado', () => {
  // currentUser no contiene numeroIdentificacion en este caso
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <RequestForm />
    </AuthContext.Provider>
  )

  // Botón Borrador
  const borradorBtn = screen.getByText('Borrador')

  // Click en Borrador
  fireEvent.click(borradorBtn)

  // Debe aparecer popup indicando usuario no autenticado
  expect(screen.getByText('Error: Usuario no autenticado')).toBeInTheDocument()
})

// Test: cuando axios falla en handleConfirm, se muestra popup de error genérico
test('handleConfirm con error muestra popup genérico', async () => {
  // Mock: axios.post rechaza para simular error de servidor
  axios.post.mockRejectedValueOnce(new Error('server fail'))

  // Render con usuario válido
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '123', correo: 'u@test.com' } }}>
      <RequestForm />
    </AuthContext.Provider>
  )

  // Ingresar monto válido
  const montoInput = screen.getByPlaceholderText("Ingresa el monto inicial (ej. 1'000,000)")
  fireEvent.change(montoInput, { target: { value: '1500000' } })

  // Click en Enviar
  fireEvent.click(screen.getByText('Enviar'))

  // Esperar popup de error genérico
  expect(await screen.findByText('Ocurrió un error al procesar la solicitud')).toBeInTheDocument()
})

// Test: enviar con monto menor al mínimo muestra popup minimumPrice
test('handleConfirm con monto menor muestra popup de monto mínimo', () => {
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '123', correo: 'u@test.com' } }}>
      <RequestForm />
    </AuthContext.Provider>
  )

  // Ingresar monto pequeño
  const montoInput = screen.getByPlaceholderText("Ingresa el monto inicial (ej. 1'000,000)")
  fireEvent.change(montoInput, { target: { value: '500000' } })

  // Click en Enviar
  fireEvent.click(screen.getByText('Enviar'))

  // Debe aparecer popup con mensaje de monto mínimo
  expect(screen.getByText("El monto inicial debe ser mayor a 1'000,000")).toBeInTheDocument()
})

// Test: al pulsar Cancelar debe navegar a /my-requests
test('Cancelar llama a navigate con /my-requests', () => {
  // Preparar mock de navigate
  const mockNavigate = jest.fn()
  const rr = require('react-router-dom')
  rr.useNavigate.mockReturnValue(mockNavigate)

  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'u@test.com' } }}>
      <RequestForm />
    </AuthContext.Provider>
  )

  // Click en Cancelar
  fireEvent.click(screen.getByText('Cancelar'))

  // Debe haberse llamado navigate con la ruta esperada
  expect(mockNavigate).toHaveBeenCalledWith('/my-requests')
})

// Test: handleConfirm (Enviar) con éxito muestra popup de enviado
test('handleConfirm envia solicitud y muestra popup de éxito', async () => {
  // Mock del post para crear solicitud en validacion
  axios.post.mockResolvedValueOnce({ data: { numero: '999' } })

  // Render con usuario autenticado que tiene numeroIdentificacion
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '123', correo: 'u@test.com' } }}>
      <RequestForm />
    </AuthContext.Provider>
  )

  // Ingresar monto valido
  const montoInput = screen.getByPlaceholderText("Ingresa el monto inicial (ej. 1'000,000)")
  fireEvent.change(montoInput, { target: { value: '1500000' } })

  // Click en Enviar
  fireEvent.click(screen.getByText('Enviar'))

  // Esperar popup de éxito
  expect(await screen.findByText('Solicitud enviada con éxito')).toBeInTheDocument()
})

// Test: handleDraft (Borrador) con éxito muestra popup de borrador
test('handleDraft guarda borrador y muestra popup de borrador', async () => {
  axios.post.mockResolvedValueOnce({ data: { numero: '888' } })

  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '456', correo: 'u2@test.com' } }}>
      <RequestForm />
    </AuthContext.Provider>
  )

  // Click en Borrador
  fireEvent.click(screen.getByText('Borrador'))

  // Esperar popup de éxito con texto de borrador
  expect(await screen.findByText('Solicitud guardada como borrador con éxito')).toBeInTheDocument()
})

// Test: useEffect carga borrador cuando viene parametro numero en la URL
test('useEffect carga datos de borrador cuando existe numero en search params', async () => {
  // configurar search params para este test
  const rr = require('react-router-dom')
  rr.useSearchParams.mockReturnValue([new URLSearchParams('numero=777')])

  // Mock axios.get para devolver datos de borrador
  axios.get.mockResolvedValueOnce({ data: { montoInicial: 2000000, tiempo: '6' } })

  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', correo: 'u@test.com' } }}>
      <RequestForm />
    </AuthContext.Provider>
  )

  // Esperar que el input se actualice con el valor del borrador
  await waitFor(() => {
    const montoInput = screen.getByPlaceholderText("Ingresa el monto inicial (ej. 1'000,000)")
    expect(montoInput.value).toBe('2000000')
  })

  // El select debe tomar el valor del borrador (esperar igualmente)
  await waitFor(() => {
    const select = screen.getByRole('combobox')
    expect(select.value).toBe('6')
  })
})
