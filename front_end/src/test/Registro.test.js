import { fireEvent, render, screen } from '@testing-library/react';
import { Register } from '../pages/Register';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

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