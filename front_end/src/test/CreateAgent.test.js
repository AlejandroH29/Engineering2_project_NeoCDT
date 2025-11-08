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
