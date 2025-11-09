import { render, screen } from '@testing-library/react'
import { AuthContext } from '../context/AuthContext'
import { CreateAgent } from '../pages/CreateAgent'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}))

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
