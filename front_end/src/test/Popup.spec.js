import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popup } from '../components/Popup';

describe('Popup component', () => {
  test('renders text and buttons, clicking calls handlers', () => {
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    render(<Popup text="Hola" onSuccess={onSuccess} successText="Sí" onClose={onClose} closeText="No" />);

    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('Sí')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Sí'));
    expect(onSuccess).toHaveBeenCalled();

    fireEvent.click(screen.getByText('No'));
    expect(onClose).toHaveBeenCalled();
  });

  test('renders only close button when onSuccess is not provided', () => {
    const onClose = jest.fn();
    render(<Popup text="Solo close" onClose={onClose} closeText="Cerrar" />);

    expect(screen.getByText('Solo close')).toBeInTheDocument();
    expect(screen.queryByText('Cerrar')).toBeInTheDocument();
  });
});
