import { render, screen } from '@testing-library/react'
import { AuthContext } from '../context/AuthContext'
import { CreateAgent } from '../pages/CreateAgent'

import axios from 'axios'
jest.mock('axios')

// mock navegacion para poder comprobar llamadas a navigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('renderiza CreateAgent', () => {
  //Renderizamos el componente sólo con el AuthContext Provider 
  render(
    //Evita que useContext(AuthContext) devuelva undefined
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
    <CreateAgent />
    </AuthContext.Provider>
  )

  //Assert: el título principal 'NeoCDT' debe estar presente
  expect(screen.getByText('NeoCDT')).toBeInTheDocument()
})

test('inputs actualizan correctamente', () => {
  //renderizamos el componente
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <CreateAgent />
    </AuthContext.Provider>
  )
  //obtenemos los inputs por su placeholder 
  const idInput = screen.getByPlaceholderText('Número de documento del agente')
  const emailInput = screen.getByPlaceholderText('Ingresa el correo del agente')
  const passInput = screen.getByPlaceholderText('Ingresa la contraseña del agente')
  const confirmInput = screen.getByPlaceholderText('Confirma la contraseña del agente')
  //simulamos cambios en cada input
  // cambiar número de documento
  idInput.value = ''
  idInput.focus()
  idInput.dispatchEvent(new Event('input', { bubbles: true }))
  // usar fireEvent para cambiar valor
  // pero testing-library recomienda fireEvent.change
  const { fireEvent } = require('@testing-library/react')
  fireEvent.change(idInput, { target: { value: '12345' } })
  fireEvent.change(emailInput, { target: { value: 'agente@test.com' } })
  fireEvent.change(passInput, { target: { value: 'Inicio2025*/' } })
  fireEvent.change(confirmInput, { target: { value: 'Inicio2025*/' } })
  //comprobamos que sus valores quedaron actualizados
  expect(idInput.value).toBe('12345')
  expect(emailInput.value).toBe('agente@test.com')
  expect(passInput.value).toBe('Inicio2025*/')
  expect(confirmInput.value).toBe('Inicio2025*/')
})

test('muestra popup cuando contraseñas no coinciden', () => {
  //renderizar componente
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <CreateAgent />
    </AuthContext.Provider>
  )
  // rellenar contraseña y confirmPassword diferente
  const passInput = screen.getByPlaceholderText('Ingresa la contraseña del agente')
  const confirmInput = screen.getByPlaceholderText('Confirma la contraseña del agente')
  const { fireEvent } = require('@testing-library/react')
  fireEvent.change(passInput, { target: { value: 'Inicio2025*/' } })
  fireEvent.change(confirmInput, { target: { value: 'OtherPass1!' } })
  // pulsar el botón "Crear Agente"
  fireEvent.click(screen.getByText('Crear Agente'))
  // comprobar que aparece el mensaje de error en el DOM
  expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument()
})

test('muestra popup cuando formato de contraseña es inválido', () => {
  // renderizar componente
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <CreateAgent />
    </AuthContext.Provider>
  )
  // rellenar confirmPassword con formato inválido (menos de 8 caracteres o sin símbolos)
  const passInput = screen.getByPlaceholderText('Ingresa la contraseña del agente')
  const confirmInput = screen.getByPlaceholderText('Confirma la contraseña del agente')
  const { fireEvent } = require('@testing-library/react')
  fireEvent.change(passInput, { target: { value: 'Ab1!' } })
  fireEvent.change(confirmInput, { target: { value: 'Ab1!' } })
  // pulsar el botón "Crear Agente"
  fireEvent.click(screen.getByText('Crear Agente'))
  // comprobar que aparece el popup de formato inválido
  expect(screen.getByText(/La contraseña debe tener al menos 8 caracteres/i)).toBeInTheDocument()
})

test('navega a /admin al cancelar con campos vacíos', () => {
  // renderizar componente
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <CreateAgent />
    </AuthContext.Provider>
  )
  // pulsar el botón "Cancelar" cuando no hay datos
  const { fireEvent } = require('@testing-library/react')
  fireEvent.click(screen.getByText('Cancelar'))
  // navigate debería haberse llamado con '/admin'
  expect(mockNavigate).toHaveBeenCalledWith('/admin')
})

test('muestra popup de éxito cuando axios.post responde correctamente', async () => {
  // preparar mock de axios.post que resuelve
  axios.post.mockResolvedValueOnce({ data: { success: true } })
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <CreateAgent />
    </AuthContext.Provider>
  )
  const { fireEvent } = require('@testing-library/react')
  const idInput = screen.getByPlaceholderText('Número de documento del agente')
  const emailInput = screen.getByPlaceholderText('Ingresa el correo del agente')
  const passInput = screen.getByPlaceholderText('Ingresa la contraseña del agente')
  const confirmInput = screen.getByPlaceholderText('Confirma la contraseña del agente')
  // llenar con datos válidos
  fireEvent.change(idInput, { target: { value: '987654' } })
  fireEvent.change(emailInput, { target: { value: 'nuevoagente@test.com' } })
  fireEvent.change(passInput, { target: { value: 'Inicio2025*/' } })
  fireEvent.change(confirmInput, { target: { value: 'Inicio2025*/' } })
  // pulsar crear y esperar al popup de éxito
  fireEvent.click(screen.getByText('Crear Agente'))
  // esperar aparición del popup de éxito
  const success = await screen.findByText('El agente ha sido creado con éxito')
  expect(success).toBeInTheDocument()
  // comprobar que axios.post fue llamado con el nuevo agente
  const expectedAgent = {
    numeroIdentificacion: '987654',
    nombreCompleto: 'Agente_nuevoagente',
    tipoIdentificacion: 'CC',
    correo: 'nuevoagente@test.com',
    contrasena: 'Inicio2025*/',
    tipo: 'Agente'
  }
  expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/usuarios/crearUsuario', expectedAgent)
})

test('cancelar con campos no vacíos muestra popup y se puede cerrar', () => {
  render(
    <AuthContext.Provider value={{ currentUser: { correo: 'jose@gmail.com', contrasena: 'Inicio2025*/' } }}> 
      <CreateAgent />
    </AuthContext.Provider>
  )
  const { fireEvent } = require('@testing-library/react')
  // completar un campo para activar el popup de cancelar
  const emailInput = screen.getByPlaceholderText('Ingresa el correo del agente')
  fireEvent.change(emailInput, { target: { value: 'algo@test.com' } })
  // pulsar cancelar
  fireEvent.click(screen.getByText('Cancelar'))
  // debería mostrarse el popup de confirmación
  expect(screen.getByText("¿Estás seguro de que quieres cancelar la creacion del agente?")).toBeInTheDocument()
  // pulsar 'Seguir editando' (closeText) para cerrarlo
  fireEvent.click(screen.getByText('Seguir editando'))
  // confirmar que ya no está el texto del popup
  expect(screen.queryByText("¿Estás seguro de que quieres cancelar la creacion del agente?")).toBeNull()
})
