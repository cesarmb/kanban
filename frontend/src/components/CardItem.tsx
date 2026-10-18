'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2 } from 'lucide-react';
import { Card } from '@/types/kanban';

interface CardItemProps {
  card: Card;
  index: number;
  columnId: string;
  onDelete: (cardId: string, columnId: string) => void;
}

export function CardItem({ card, index, columnId, onDelete }: CardItemProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          data-testid={`card-${card.id}`}
        >
          <div className="card-top">
            <h3 className="card-title">{card.title}</h3>
            <button
              type="button"
              className="card-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.id, columnId);
              }}
              title="Eliminar tarjeta"
              aria-label={`Eliminar tarjeta ${card.title}`}
              data-testid={`delete-card-${card.id}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
          {card.details && (
            <p className="card-details">{card.details}</p>
          )}
        </article>
      )}
    </Draggable>
  );
}
