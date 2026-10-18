import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropContext } from '@hello-pangea/dnd';
import { Column } from '@/components/Column';
import { Column as ColumnType, Card } from '@/types/kanban';

const mockColumn: ColumnType = {
  id: 'col-1',
  title: 'En Analisis',
  cardIds: ['card-1'],
};

const mockCards: Card[] = [
  {
    id: 'card-1',
    title: 'Tarea 1',
    details: 'Detalle de prueba',
  },
];

function renderColumnWithDnd(ui: React.ReactNode) {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      {ui}
    </DragDropContext>
  );
}

describe('Column component', () => {
  it('renderiza el titulo y el conteo de tarjetas', () => {
    renderColumnWithDnd(
      <Column
        column={mockColumn}
        cards={mockCards}
        onRename={vi.fn()}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    expect(screen.getByTestId('column-title-col-1')).toHaveTextContent('En Analisis');
    expect(screen.getByTestId('column-count-col-1')).toHaveTextContent('1');
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
  });

  it('permite renombrar la columna y guardar con Enter', async () => {
    const user = userEvent.setup();
    const handleRename = vi.fn();

    renderColumnWithDnd(
      <Column
        column={mockColumn}
        cards={mockCards}
        onRename={handleRename}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const titleDisplay = screen.getByTestId('column-title-display-col-1');
    await user.click(titleDisplay);

    const input = screen.getByTestId('column-title-input-col-1');
    expect(input).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'Descubrimiento{Enter}');

    expect(handleRename).toHaveBeenCalledTimes(1);
    expect(handleRename).toHaveBeenCalledWith('col-1', 'Descubrimiento');
  });

  it('cancela la edicion al pulsar Escape', async () => {
    const user = userEvent.setup();
    const handleRename = vi.fn();

    renderColumnWithDnd(
      <Column
        column={mockColumn}
        cards={mockCards}
        onRename={handleRename}
        onDeleteCard={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const titleDisplay = screen.getByTestId('column-title-display-col-1');
    await user.click(titleDisplay);

    const input = screen.getByTestId('column-title-input-col-1');
    await user.clear(input);
    await user.type(input, 'Texto cancelado');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(handleRename).not.toHaveBeenCalled();
    expect(screen.getByTestId('column-title-col-1')).toHaveTextContent('En Analisis');
  });

  it('abre el modal de agregar tarjeta al hacer clic en Nueva Tarjeta', async () => {
    const user = userEvent.setup();
    const handleOpenModal = vi.fn();

    renderColumnWithDnd(
      <Column
        column={mockColumn}
        cards={mockCards}
        onRename={vi.fn()}
        onDeleteCard={vi.fn()}
        onOpenAddModal={handleOpenModal}
      />
    );

    const addBtn = screen.getByTestId('add-card-btn-col-1');
    await user.click(addBtn);

    expect(handleOpenModal).toHaveBeenCalledTimes(1);
    expect(handleOpenModal).toHaveBeenCalledWith('col-1');
  });
});
