import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { MyRequests } from '../pages/MyRequests';

// mock navegacion para poder comprobar llamadas a navigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// mock de axios para controlar respuestas HTTP
jest.mock('axios');

// Mock ligero de RequestCard para evitar dependencias en la UI
jest.mock('../components/RequestCard', () => ({
  // Mock de RequestCard que expone botones para probar callbacks
  RequestCard: ({ numero, estado, monto, onEdit, onDelete, onCancel }) => (
    <div data-testid={`request-${numero}`}>
      <span>{`${numero}-${estado}-${monto}`}</span>
      <button data-testid={`edit-${numero}`} onClick={onEdit}>Editar</button>
      <button data-testid={`delete-${numero}`} onClick={onDelete}>Eliminar</button>
      <button data-testid={`cancel-${numero}`} onClick={onCancel}>Cancelar</button>
    </div>
  ),
}));

// Mock simple de Popup para evitar lógica de modales/portales
jest.mock('../components/Popup', () => ({
  // Mock de Popup que expone botones para simular confirmación o cierre
  Popup: ({ text, onSuccess, onClose, successText = 'Ok', closeText = 'Close' }) => (
    <div data-testid="popup">
      <div>{text}</div>
      {onSuccess && <button data-testid="popup-success" onClick={onSuccess}>{successText}</button>}
      {onClose && <button data-testid="popup-close" onClick={onClose}>{closeText}</button>}
    </div>
  ),
}));

// Limpiar mocks antes de cada test
beforeEach(() => {
  // Limpiar mocks entre tests
  jest.clearAllMocks();
  // Mock global de alert para evitar errores de jsdom
  window.alert = jest.fn();
});

// Test: renderiza título y nombre de usuario
test('renderiza título y nombre de usuario', () => {
  // Renderizar el componente envuelto en AuthContext con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Verificar que el título principal esté presente
  expect(screen.getByText('Mis Solicitudes')).toBeInTheDocument();

  // Verificar que el nombre del usuario se muestre
  expect(screen.getByText(/Usuario: Usuario Test/)).toBeInTheDocument();
});

// Test: muestra mensaje de lista vacía cuando el servidor devuelve un arreglo vacío
test('muestra mensaje cuando no hay solicitudes', async () => {
  // Hacer que axios.get resuelva con un arreglo vacío
  axios.get.mockResolvedValue({ data: [] });

  // Renderizar con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar a que el componente termine de cargar y verificar el texto de vacío
  expect(await screen.findByText('No tienes solicitudes todavía')).toBeInTheDocument();
});

// Test: renderiza RequestCard cuando el servidor devuelve al menos una solicitud
test('renderiza RequestCard cuando hay solicitudes', async () => {
  // Preparar una solicitud simulada
  const mockRequests = [
    { numero: '100', estado: 'Pendiente', montoInicial: 100000, tiempo: 30, tasaInteres: 0.02, montoGanancia: 2000 },
  ];

  // Hacer que axios.get resuelva con la solicitud simulada
  axios.get.mockResolvedValue({ data: mockRequests });

  // Renderizar el componente con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar y verificar que el RequestCard mock aparezca con el número correcto
  expect(await screen.findByTestId('request-100')).toBeInTheDocument();
});

// Test: muestra alerta cuando la petición falló
test('muestra alerta cuando la carga falla', async () => {
  // Simular rechazo de axios con mensaje de error
  axios.get.mockRejectedValue({ response: { data: { error: 'Error servidor' } } });

  // Espiar window.alert
  window.alert = jest.fn();

  // Renderizar con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar y comprobar que alert fue llamado con el mensaje del servidor
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Error servidor'));
});

// Test: navegar al editar solicitud usando el callback onEdit
test('navega al editar solicitud', async () => {
  // Preparar mock de solicitudes
  const mockRequests = [
    { numero: '100', estado: 'Pendiente', montoInicial: 100000, tiempo: 30, tasaInteres: 0.02, montoGanancia: 2000 },
  ];

  // Hacer que axios.get resuelva con la solicitud
  axios.get.mockResolvedValue({ data: mockRequests });

  // Renderizar el componente con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar a que aparezca el botón de editar y hacer click
  const editButton = await screen.findByTestId('edit-100');
  // Click en el botón de editar usando fireEvent para envolver en act
  fireEvent.click(editButton);

  // Verificar que la navegación se llamó con la ruta esperada
  expect(mockNavigate).toHaveBeenCalledWith('/request-form?numero=100');
});

// Test: no debe llamar a axios.get si no hay usuario en contexto
test('no llama axios si no hay usuario', async () => {
  // Hacer que axios.get resuelva si se llama por accidente
  axios.get.mockResolvedValue({ data: [] });

  // Renderizar sin usuario (currentUser undefined)
  render(
    <AuthContext.Provider value={{ currentUser: undefined }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar un breve momento y asegurar que axios.get no fue llamado
  await waitFor(() => expect(axios.get).not.toHaveBeenCalled());
});

// Test: al pulsar cancelar se muestra el popup de confirmación
test('al pulsar cancelar muestra popup de confirmación', async () => {
  // Preparar una solicitud simulada
  const mockRequests = [
    { numero: '200', estado: 'Pendiente', montoInicial: 50000, tiempo: 15, tasaInteres: 0.01, montoGanancia: 500 },
  ];

  // Hacer que axios.get resuelva con la solicitud
  axios.get.mockResolvedValue({ data: mockRequests });

  // Renderizar el componente con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar a que aparezca el botón de cancelar y hacer click
  const cancelButton = await screen.findByTestId('cancel-200');
  // Simular click en cancelar usando fireEvent
  fireEvent.click(cancelButton);

  // Verificar que el popup de confirmación se muestre con el texto esperado (esperar async)
  const popupCancel = await screen.findByTestId('popup');
  expect(popupCancel).toHaveTextContent('¿Estás seguro de cancelar esta solicitud?');
});

// Test: al pulsar eliminar se muestra el popup de confirmación de eliminación
test('al pulsar eliminar muestra popup de confirmación', async () => {
  // Preparar una solicitud simulada
  const mockRequests = [
    { numero: '300', estado: 'Pendiente', montoInicial: 75000, tiempo: 20, tasaInteres: 0.015, montoGanancia: 1125 },
  ];

  // Hacer que axios.get resuelva con la solicitud
  axios.get.mockResolvedValue({ data: mockRequests });

  // Renderizar el componente con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar a que aparezca el botón de eliminar y hacer click
  const deleteButton = await screen.findByTestId('delete-300');
  // Simular click en eliminar usando fireEvent
  fireEvent.click(deleteButton);

  // Verificar que el popup de confirmación de eliminación se muestre con el texto esperado (esperar async)
  const popupDelete = await screen.findByTestId('popup');
  expect(popupDelete).toHaveTextContent('¿Estás seguro de eliminar esta solicitud?');
});

// Test: renderiza múltiples RequestCard cuando hay varias solicitudes
test('renderiza múltiples solicitudes', async () => {
  // Preparar varias solicitudes simuladas
  const mockRequests = [
    { numero: '400', estado: 'Aprobada', montoInicial: 120000, tiempo: 60, tasaInteres: 0.03, montoGanancia: 3600 },
    { numero: '401', estado: 'Rechazada', montoInicial: 50000, tiempo: 10, tasaInteres: 0.01, montoGanancia: 500 },
  ];

  // Hacer que axios.get resuelva con las solicitudes
  axios.get.mockResolvedValue({ data: mockRequests });

  // Renderizar el componente con usuario simulado
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar y verificar que ambos RequestCard mock aparezcan
  expect(await screen.findByTestId('request-400')).toBeInTheDocument();
  expect(await screen.findByTestId('request-401')).toBeInTheDocument();
});

// Test: performCancel exitoso muestra popup de éxito y refresca la lista
test('performCancel exitoso muestra popup de éxito y refresca lista', async () => {
  // axios.get: primera llamada devuelve la solicitud, segunda llamada (refresh) devuelve arreglo vacío
  axios.get
    .mockResolvedValueOnce({ data: [ { numero: '500', estado: 'Pendiente', montoInicial: 1000, tiempo: 1, tasaInteres: 0.01, montoGanancia: 10 } ] })
    .mockResolvedValueOnce({ data: [] });

  // axios.put responde OK para la cancelación
  axios.put.mockResolvedValue({});

  // Renderizar componente
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar al botón de cancelar y hacer click
  const cancelBtn = await screen.findByTestId('cancel-500');
  fireEvent.click(cancelBtn);

  // Popup de confirmación aparece
  const popup = await screen.findByTestId('popup');
  expect(popup).toHaveTextContent('¿Estás seguro de cancelar esta solicitud?');

  // Click en el botón de confirmación del popup para ejecutar performCancel
  fireEvent.click(screen.getByTestId('popup-success'));

  // Esperar que axios.put haya sido llamado con la URL correcta
  await waitFor(() => expect(axios.put).toHaveBeenCalledWith('http://localhost:3000/solicitudes/cancelarSolicitudCDT/500'));

  // Esperar que axios.get haya sido llamado nuevamente para refrescar (total 2 llamadas)
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

  // El popup de éxito debe mostrarse
  expect(await screen.findByTestId('popup')).toHaveTextContent('Solicitud cancelada exitosamente');
});

// Test: performDelete exitoso muestra popup de éxito y refresca la lista
test('performDelete exitoso muestra popup de éxito y refresca lista', async () => {
  // axios.get: primera llamada devuelve la solicitud, segunda llamada (refresh) devuelve arreglo vacío
  axios.get
    .mockResolvedValueOnce({ data: [ { numero: '600', estado: 'Pendiente', montoInicial: 2000, tiempo: 2, tasaInteres: 0.02, montoGanancia: 40 } ] })
    .mockResolvedValueOnce({ data: [] });

  // axios.delete responde OK para la eliminación
  axios.delete.mockResolvedValue({});

  // Renderizar componente
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar al botón de eliminar y hacer click
  const deleteBtn = await screen.findByTestId('delete-600');
  fireEvent.click(deleteBtn);

  // Popup de confirmación aparece
  const popup = await screen.findByTestId('popup');
  expect(popup).toHaveTextContent('¿Estás seguro de eliminar esta solicitud?');

  // Click en el botón de confirmación del popup para ejecutar performDelete
  fireEvent.click(screen.getByTestId('popup-success'));

  // Esperar que axios.delete haya sido llamado con la URL correcta
  await waitFor(() => expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/solicitudes/eliminarSolicitudCDT/600'));

  // Esperar que axios.get haya sido llamado nuevamente para refrescar (total 2 llamadas)
  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

  // El popup de éxito debe mostrarse
  expect(await screen.findByTestId('popup')).toHaveTextContent('Solicitud eliminada exitosamente');
});

// Test: performCancel con error muestra popup de error
test('performCancel con error muestra popup de error', async () => {
  // axios.get: devuelve la solicitud
  axios.get.mockResolvedValueOnce({ data: [ { numero: '700', estado: 'Pendiente', montoInicial: 3000, tiempo: 3, tasaInteres: 0.03, montoGanancia: 90 } ] });

  // axios.put rechaza para simular error
  axios.put.mockRejectedValue(new Error('fail'));

  // Renderizar componente
  render(
    <AuthContext.Provider value={{ currentUser: { numeroIdentificacion: '1', nombreCompleto: 'Usuario Test' } }}>
      <MyRequests />
    </AuthContext.Provider>
  );

  // Esperar al botón de cancelar y hacer click
  const cancelBtn = await screen.findByTestId('cancel-700');
  fireEvent.click(cancelBtn);

  // Click en el botón de confirmación del popup para ejecutar performCancel (que fallará)
  fireEvent.click(await screen.findByTestId('popup-success'));

  // Esperar que el popup de error aparezca con el texto esperado
  expect(await screen.findByTestId('popup')).toHaveTextContent('Error al cancelar la solicitud');
});
