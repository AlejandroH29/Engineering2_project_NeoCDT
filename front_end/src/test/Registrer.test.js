import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Register } from '../pages/Register';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders Register component', () => {
  render(<Register />); //Renderiza el componente
  expect(screen.getByText('NeoCDT')).toBeInTheDocument(); //Verifica que el título esté en el documento
});

test("Navegar al login", () => {
  const mockNavigate = jest.fn(); // Crea una función simulada para navegar
  useNavigate.mockReturnValue(mockNavigate); // Hace que useNavigate devuelva la función simulada
  render(<Register/>) //Renderiza el componente
  fireEvent.click(screen.getByText("Login")); //Simula el click en el enlace de Login
  expect(mockNavigate).toHaveBeenCalledWith("/"); //Verifica que la función de navegación haya sido llamada con el argumento "/"
})

test("handleChange actualiza correctamente", () => {
  const { getByPlaceholderText } = render(<Register />); //Permite buscar los elementos del componente por su placeholder
  const emailInput = getByPlaceholderText('Ingresa tu correo electrónico'); //Guarda el input en una variable
  fireEvent.change(emailInput, { target: { value: 'prueba@ejemplo.com' } }); //Simula un cambio en el input
  expect(emailInput.value).toBe('prueba@ejemplo.com'); //Verifica que el valor del input haya sido actualizado correctamente
})

test('muestra error de validación de contraseña cuando es inválida', async () => {
  render(<Register />);

  // Rellenar campos mínimos necesarios
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu correo electrónico'), { target: { value: 'prueba@ejemplo.com' } });
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'abc' } });

  fireEvent.click(screen.getByText('Registrarse'));

  expect(await screen.findByText('La contraseña no cumple los criterios de seguridad.')).toBeInTheDocument();
});

test('envía formulario correctamente y navega al login', async () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate);

  axios.post.mockResolvedValue({ data: {} });
  window.alert = jest.fn();

  render(<Register />);

  // Rellenar campos
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu número de cocumento'), { target: { value: '123456' } });
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu nombre completo'), { target: { value: 'Usuario Test' } });
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu correo electrónico'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'Aa1!aaaa' } });

  fireEvent.click(screen.getByText('Registrarse'));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/usuarios/crearUsuario',
      expect.objectContaining({
        nombreCompleto: 'Usuario Test',
        correo: 'test@example.com',
        contrasena: 'Aa1!aaaa',
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

test('muestra popup con mensaje de error cuando el servidor responde con error', async () => {
  axios.post.mockRejectedValue({ response: { data: { error: 'Usuario ya existe' } } });

  render(<Register />);

  // Rellenar campos con contraseña válida
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu número de cocumento'), { target: { value: '123456' } });
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu nombre completo'), { target: { value: 'Usuario Test' } });
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu correo electrónico'), { target: { value: 'test2@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), { target: { value: 'Aa1!aaaa' } });

  fireEvent.click(screen.getByText('Registrarse'));

  expect(await screen.findByText('Usuario ya existe')).toBeInTheDocument();
});