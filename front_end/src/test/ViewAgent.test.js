// Importa las utilidades de testing para renderizar y simular eventos en componentes
import { fireEvent, render, screen, within } from '@testing-library/react'; // helpers de testing
// Importa el componente ViewAgent a probar
import { ViewAgent } from '../pages/ViewAgent'; // componente a testear
// Importa useNavigate para poder interceptar la navegación
import { useNavigate } from 'react-router-dom'; // hook de navegación

// Mockea react-router-dom y en particular useNavigate
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn(), })); // reemplaza useNavigate por mock

// Test: asegura que el componente se renderiza y muestra el título 'NeoCDT'
test('renders ViewAgent component with title', () => {
	render(<ViewAgent />); // renderiza ViewAgent en el DOM de pruebas
	expect(screen.getByText('NeoCDT')).toBeInTheDocument(); // comprueba que el título exista
});

// Test: verifica que al pulsar 'Ingresar' dentro de 'Gestionar CDT'S' se navegue a '/requests-list'
test('navigates to requests-list when clicking Gestionar CDT\'S -> Ingresar', () => {
	const mockNavigate = jest.fn(); // crea mock para la navegación
	useNavigate.mockReturnValue(mockNavigate); // configura useNavigate para devolver el mock
	render(<ViewAgent />); // renderiza el componente

	const container = screen.getByText("Gestionar CDT'S").closest('div'); // localiza el contenedor del texto
	const button = within(container).getByRole('button', { name: /Ingresar/i }); // obtiene el botón 'Ingresar'

	fireEvent.click(button); // simula el click
	expect(mockNavigate).toHaveBeenCalledWith('/requests-list'); // verifica que navigate fue llamado con '/requests-list'
});

