'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Pencil } from 'lucide-react';
import { Column as ColumnType, Card } from '@/types/kanban';
import { CardItem } from './CardItem';

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onRename: (columnId: string, newTitle: string) => void;
  onDeleteCard: (cardId: string, columnId: string) => void;
  onOpenAddModal: (columnId: string) => void;
}

export function Column({
  column,
  cards,
  onRename,
  onDeleteCard,
  onOpenAddModal,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(column.title);
  }, [column.title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== column.title) {
      onRename(column.id, trimmed);
    } else {
      setTitleValue(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitleValue(column.title);
      setIsEditing(false);
    }
  };

  return (
    <section
      className="kanban-column"
      data-testid={`column-${column.id}`}
      aria-label={column.title}
    >
      <header className="column-header">
        <div className="column-title-container">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="column-title-input"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              data-testid={`column-title-input-${column.id}`}
              aria-label={`Editar nombre de la columna ${column.title}`}
            />
          ) : (
            <div
              className="column-title-display"
              onClick={() => setIsEditing(true)}
              title="Haz clic para renombrar la columna"
              data-testid={`column-title-display-${column.id}`}
            >
              <h2
                className="column-title-text"
                data-testid={`column-title-${column.id}`}
              >
                {column.title}
              </h2>
              <Pencil size={13} className="column-edit-icon" aria-hidden="true" />
            </div>
          )}
        </div>

        <span
          className="column-count-badge"
          data-testid={`column-count-${column.id}`}
          aria-label={`${cards.length} tarjetas`}
        >
          {cards.length}
        </span>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-cards-container ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
            data-testid={`column-cards-${column.id}`}
          >
            {cards.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                index={index}
                columnId={column.id}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="column-empty-state">Sin tarjetas</div>
            )}
          </div>
        )}
      </Droppable>

      <footer className="column-footer">
        <button
          type="button"
          className="btn-add-card"
          onClick={() => onOpenAddModal(column.id)}
          data-testid={`add-card-btn-${column.id}`}
        >
          <Plus size={16} />
          <span>Nueva Tarjeta</span>
        </button>
      </footer>
    </section>
  );
}
