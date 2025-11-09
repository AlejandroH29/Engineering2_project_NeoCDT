// Importa utilidades de testing para renderizar y simular eventos
import { fireEvent, render, screen, within } from '@testing-library/react'; // helpers de testing
// Importa el componente ViewClient que será probado
import { ViewClient } from '../pages/ViewClient'; // componente a testear
// Importa useNavigate para poder mockear la navegación
import { useNavigate } from 'react-router-dom'; // hook de navegación

// Mock de react-router-dom para controlar useNavigate en los tests
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn(), })); // reemplaza useNavigate por mock

// Test: comprueba que el componente se renderiza y muestra el título 'NeoCDT'
test('renders ViewClient component with title', () => {
	render(<ViewClient />); // renderiza el componente
	expect(screen.getByText('NeoCDT')).toBeInTheDocument(); // verifica que el título exista
});

// Test: verifica la navegación a '/request-form' al pulsar el botón marcado con data-testid
test('navigates to request-form when clicking Solicitar CDT Ingresar (by testid)', () => {
	const mockNavigate = jest.fn(); // crea mock de navigate
	useNavigate.mockReturnValue(mockNavigate); // configura useNavigate para devolver el mock
	render(<ViewClient />); // renderiza el componente

	const button = screen.getByTestId('requestFormButton'); // obtiene el botón por data-testid
	fireEvent.click(button); // simula click en el botón

	expect(mockNavigate).toHaveBeenCalledWith('/request-form'); // verifica la ruta de navegación
});

// Test: verifica la navegación a '/my-requests' al pulsar el botón dentro de 'Gestionar tus CDT'S'
test("navigates to my-requests when clicking 'Gestionar tus CDT'S' Ingresar", () => {
	const mockNavigate = jest.fn(); // crea mock de navigation
	useNavigate.mockReturnValue(mockNavigate); // configura useNavigate
	render(<ViewClient />); // renderiza el componente

	const container = screen.getByText("Gestionar tus CDT'S").closest('div'); // localiza el contenedor del texto
	const button = within(container).getByRole('button', { name: /Ingresar/i }); // obtiene el botón 'Ingresar'

	fireEvent.click(button); // simula click
	expect(mockNavigate).toHaveBeenCalledWith('/my-requests'); // verifica la llamada a navigate con '/my-requests'
});

