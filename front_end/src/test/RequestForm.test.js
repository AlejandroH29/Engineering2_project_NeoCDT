import { render, screen } from '@testing-library/react'
import { AuthContext } from '../context/AuthContext'
import { RequestForm } from '../pages/RequestForm'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue([new URLSearchParams()]),
}))

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
  const { fireEvent } = require('@testing-library/react')
  fireEvent.change(montoInput, { target: { value: '500000' } })
  //comprobamos que aparece el mensaje de alerta en el DOM
  expect(screen.getByText("El monto debe ser de al menos 1'000.000")).toBeInTheDocument()
})
