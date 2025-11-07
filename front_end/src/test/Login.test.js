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

// Tests adicionales añadidos para cubrir ruteo y manejo de respuestas de la API
const axios = require('axios');
jest.mock('axios');

test.each([
    ['Cliente', '/client'],
    ['Agente', '/agent'],
    ['Admin', '/admin'],
])('navega segun tipo de usuario: %s -> %s', async (tipo, expectedRoute) => {
    // Mock de navigate y alert
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    window.alert = jest.fn();

    // Mock de la respuesta de axios para simular inicio de sesión exitoso
    axios.post.mockResolvedValue({ data: { tipo } });

    // Renderizar con el provider real para que login del contexto exista
    render(
        <AuthProvider>
            <Login />
        </AuthProvider>
    );

    // Rellenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu correo electrónico'), { target: { value: 'papirico@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'Root1234+' } });

    // Enviar formulario
    fireEvent.click(screen.getByText('Iniciar Sesión'));

    // Esperar y comprobar efectos: alert mostrado y navegación al route esperado
    await screen.findByText('NeoCDT'); // espera mínima para que se procese la promesa
    expect(window.alert).toHaveBeenCalledWith('Sesion iniciada');
    expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
});