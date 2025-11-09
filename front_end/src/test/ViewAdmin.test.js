// Importa utilidades de la librería de testing para renderizar componentes y simular eventos
import { fireEvent, render, screen, within } from '@testing-library/react'; // import testing helpers
// Importa el componente ViewAdmin que vamos a probar
import { ViewAdmin } from '../pages/ViewAdmin'; // componente a testear
// Importa useNavigate para poder mockear la navegación
import { useNavigate } from 'react-router-dom'; // hook de navegación

// Mockea el módulo 'react-router-dom' devolviendo una versión simulada de useNavigate
jest.mock('react-router-dom', () => ({ useNavigate: jest.fn(), })); // reemplaza useNavigate por un mock

// Test: verifica que el componente se renderiza y muestra el título 'NeoCDT'
test('renders ViewAdmin component with title', () => {
	render(<ViewAdmin />); // renderiza el componente en el DOM de pruebas
	expect(screen.getByText('NeoCDT')).toBeInTheDocument(); // verifica que el título exista
});

// Test: verifica que al hacer click en "Crear agentes -> Ingresar" se llame a navigate con '/create-agent'
test('navigates to create-agent when clicking Crear agentes -> Ingresar', () => {
	const mockNavigate = jest.fn(); // crea un mock para la función de navegación
	useNavigate.mockReturnValue(mockNavigate); // hace que useNavigate devuelva el mock
	render(<ViewAdmin />); // renderiza el componente

	const container = screen.getByText('Crear agentes').closest('div'); // encuentra el contenedor del texto 'Crear agentes'
	const button = within(container).getByRole('button', { name: /Ingresar/i }); // encuentra el botón 'Ingresar' dentro del contenedor

	fireEvent.click(button); // simula un click en el botón
	expect(mockNavigate).toHaveBeenCalledWith('/create-agent'); // espera que navigate haya sido llamado con '/create-agent'
});

// Test: verifica que al hacer click en "Gestionar CDT'S -> Ingresar" se llame a navigate con '/requests-list'
test('navigates to requests-list when clicking Gestionar CDT\'S -> Ingresar', () => {
	const mockNavigate = jest.fn(); // crea un mock para la navegación
	useNavigate.mockReturnValue(mockNavigate); // configura useNavigate para devolver el mock
	render(<ViewAdmin />); // renderiza el componente

	const container = screen.getByText("Gestionar CDT'S").closest('div'); // localiza el contenedor del texto "Gestionar CDT'S"
	const button = within(container).getByRole('button', { name: /Ingresar/i }); // obtiene el botón 'Ingresar' dentro del contenedor

	fireEvent.click(button); // simula el click
	expect(mockNavigate).toHaveBeenCalledWith('/requests-list'); // verifica que navigate fue llamado con '/requests-list'
});

