import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { CardItem } from '@/components/CardItem';
import { Card } from '@/types/kanban';

const mockCard: Card = {
  id: 'card-1',
  title: 'Disenar base de datos',
  details: 'Crear diagramas entidad-relacion en PostgreSQL.',
};

function renderWithDnd(ui: React.ReactNode) {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="col-1">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {ui}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

describe('CardItem component', () => {
  it('muestra el titulo y los detalles de la tarjeta', () => {
    renderWithDnd(
      <CardItem
        card={mockCard}
        index={0}
        columnId="col-1"
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Disenar base de datos')).toBeInTheDocument();
    expect(screen.getByText('Crear diagramas entidad-relacion en PostgreSQL.')).toBeInTheDocument();
  });

  it('llama a onDelete con el id correcto al pulsar el boton de eliminar', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    renderWithDnd(
      <CardItem
        card={mockCard}
        index={0}
        columnId="col-1"
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByTestId('delete-card-card-1');
    await user.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('card-1', 'col-1');
  });
});
