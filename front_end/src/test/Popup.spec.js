import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popup } from '../components/Popup';

describe('Popup component', () => {
  // Test: el popup renderiza el texto y los botones, y las funciones pasan cuando se hace click
  test('renders text and buttons, clicking calls handlers', () => {
    // Creamos funciones simuladas para onSuccess y onClose
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    // Renderizamos el Popup pasando texto y las funciones simuladas
    render(<Popup text="Hola" onSuccess={onSuccess} successText="Sí" onClose={onClose} closeText="No" />);

    // Comprobamos que el texto y ambos botones estén en el documento
    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('Sí')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();

    // Simulamos click en el botón de éxito y comprobamos que su handler fue llamado
    fireEvent.click(screen.getByText('Sí'));
    expect(onSuccess).toHaveBeenCalled();

    // Simulamos click en el botón de cerrar y comprobamos que su handler fue llamado
    fireEvent.click(screen.getByText('No'));
    expect(onClose).toHaveBeenCalled();
  });

  // Test: cuando onSuccess no está provisto, sólo debe renderizarse el botón de cierre
  test('renders only close button when onSuccess is not provided', () => {
    // Creamos un onClose simulado
    const onClose = jest.fn();
    // Renderizamos el Popup sólo con onClose
    render(<Popup text="Solo close" onClose={onClose} closeText="Cerrar" />);

    // Verificamos que el texto y el botón de cerrar estén presentes
    expect(screen.getByText('Solo close')).toBeInTheDocument();
    expect(screen.queryByText('Cerrar')).toBeInTheDocument();
  });
});
