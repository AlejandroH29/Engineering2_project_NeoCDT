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
