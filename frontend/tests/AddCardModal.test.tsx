import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddCardModal } from '@/components/AddCardModal';

describe('AddCardModal component', () => {
  it('no se renderiza si isOpen es falso', () => {
    const { container } = render(
      <AddCardModal
        isOpen={false}
        columnTitle="Por Hacer"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('se renderiza correctamente cuando isOpen es verdadero', () => {
    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Por Hacer"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Nueva Tarjeta en/i)).toHaveTextContent('Por Hacer');
    expect(screen.getByTestId('card-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('card-details-input')).toBeInTheDocument();
  });

  it('permite ingresar titulo y detalles y enviar el formulario', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const handleClose = vi.fn();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Por Hacer"
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    const titleInput = screen.getByTestId('card-title-input');
    const detailsInput = screen.getByTestId('card-details-input');
    const submitBtn = screen.getByTestId('submit-add-card-btn');

    await user.type(titleInput, 'Mi nueva tarea');
    await user.type(detailsInput, 'Descripcion detallada de la tarea');
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('Mi nueva tarea', 'Descripcion detallada de la tarea');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('deshabilita el boton de envio si el titulo esta vacio', () => {
    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Por Hacer"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const submitBtn = screen.getByTestId('submit-add-card-btn');
    expect(submitBtn).toBeDisabled();
  });

  it('cierra el modal al pulsar la tecla Escape', () => {
    const handleClose = vi.fn();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Por Hacer"
        onClose={handleClose}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('cierra el modal al hacer clic en cancelar', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <AddCardModal
        isOpen={true}
        columnTitle="Por Hacer"
        onClose={handleClose}
        onSubmit={vi.fn()}
      />
    );

    await user.click(screen.getByTestId('cancel-add-card-btn'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
