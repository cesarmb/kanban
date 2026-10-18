import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Board } from '@/components/Board';

describe('Board component', () => {
  it('renderiza las 5 columnas iniciales con sus datos de ejemplo', () => {
    render(<Board />);

    expect(screen.getByTestId('column-col-1')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-2')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-3')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-4')).toBeInTheDocument();
    expect(screen.getByTestId('column-col-5')).toBeInTheDocument();

    expect(screen.getByTestId('column-title-col-1')).toHaveTextContent('Por Hacer');
    expect(screen.getByTestId('column-title-col-2')).toHaveTextContent('En Analisis');
    expect(screen.getByTestId('column-title-col-3')).toHaveTextContent('En Progreso');
    expect(screen.getByTestId('column-title-col-4')).toHaveTextContent('En Revision');
    expect(screen.getByTestId('column-title-col-5')).toHaveTextContent('Completado');

    expect(screen.getByText('Definir arquitectura de microservicios')).toBeInTheDocument();
  });

  it('permite anadir una nueva tarjeta a traves del modal', async () => {
    const user = userEvent.setup();
    render(<Board />);

    const addBtn = screen.getByTestId('add-card-btn-col-1');
    await user.click(addBtn);

    expect(screen.getByTestId('add-card-modal')).toBeInTheDocument();

    const titleInput = screen.getByTestId('card-title-input');
    const detailsInput = screen.getByTestId('card-details-input');
    const submitBtn = screen.getByTestId('submit-add-card-btn');

    await user.type(titleInput, 'Nueva Tarea Integrada');
    await user.type(detailsInput, 'Detalles de la nueva tarea integrada');
    await user.click(submitBtn);

    expect(screen.queryByTestId('add-card-modal')).not.toBeInTheDocument();
    expect(screen.getByText('Nueva Tarea Integrada')).toBeInTheDocument();
    expect(screen.getByText('Detalles de la nueva tarea integrada')).toBeInTheDocument();
  });

  it('permite eliminar una tarjeta existente del tablero', async () => {
    const user = userEvent.setup();
    render(<Board />);

    expect(screen.getByText('Definir arquitectura de microservicios')).toBeInTheDocument();

    const deleteBtn = screen.getByTestId('delete-card-card-1');
    await user.click(deleteBtn);

    expect(screen.queryByText('Definir arquitectura de microservicios')).not.toBeInTheDocument();
  });

  it('permite renombrar una columna en el tablero', async () => {
    const user = userEvent.setup();
    render(<Board />);

    const titleDisplay = screen.getByTestId('column-title-display-col-1');
    await user.click(titleDisplay);

    const input = screen.getByTestId('column-title-input-col-1');
    await user.clear(input);
    await user.type(input, 'Backlog Priorizado{Enter}');

    expect(screen.getByTestId('column-title-col-1')).toHaveTextContent('Backlog Priorizado');
  });
});
