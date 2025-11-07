import { fireEvent, render, screen } from '@testing-library/react';
import { Login } from '../pages/Login';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext'; 

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

test('renders Login component', () => {
    render(
        <AuthProvider>
            <Login />
        </AuthProvider>); //Renderiza el componente
    expect(screen.getByText('NeoCDT')).toBeInTheDocument(); //Verifica que el título esté en el documento
});

test("Navegar al register", () => {
  const mockNavigate = jest.fn(); // Crea una función simulada para navegar
  useNavigate.mockReturnValue(mockNavigate); // Hace que useNavigate devuelva la función simulada
  render(
        <AuthProvider>
            <Login />
        </AuthProvider>) //Al usar el algo del contexto en el codigo del componente, es necesario envolverlo en el Provider para que la prueba funcione correctamente
  fireEvent.click(screen.getByText("Register")); //Simula el click en el enlace de Register
  expect(mockNavigate).toHaveBeenCalledWith("/register"); //Verifica que la función de navegación haya sido llamada con el argumento "/register"
})

test("handleChange actualiza correctamente", () => {
  const { getByPlaceholderText } = render(
        <AuthProvider>
            <Login />
        </AuthProvider>); //Permite buscar los elementos del componente por su placeholder
  const emailInput = getByPlaceholderText('Ingresa tu contraseña'); //Guarda el input en una variable
  fireEvent.change(emailInput, { target: { value: 'Prueba123*' } }); //Simula un cambio en el input
  expect(emailInput.value).toBe('Prueba123*'); //Verifica que el valor del input haya sido actualizado correctamente
})