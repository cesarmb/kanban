import { useState } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import { BoardState, Card } from '@/types/kanban';
import { initialData } from '@/data/initialData';

export function useKanban(initialState: BoardState = initialData) {
  const [board, setBoard] = useState<BoardState>(initialState);

  const renameColumn = (columnId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setBoard((prev) => {
      const targetColumn = prev.columns[columnId];
      if (!targetColumn) return prev;

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...targetColumn,
            title: trimmed,
          },
        },
      };
    });
  };

  const addCard = (columnId: string, title: string, details: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newCardId = `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCard: Card = {
      id: newCardId,
      title: trimmedTitle,
      details: details.trim(),
    };

    setBoard((prev) => {
      const column = prev.columns[columnId];
      if (!column) return prev;

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [newCardId]: newCard,
        },
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            cardIds: [...column.cardIds, newCardId],
          },
        },
      };
    });
  };

  const deleteCard = (cardId: string, columnId: string) => {
    setBoard((prev) => {
      const column = prev.columns[columnId];
      if (!column) return prev;

      const remainingCards = { ...prev.cards };
      delete remainingCards[cardId];

      return {
        ...prev,
        cards: remainingCards,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
          },
        },
      };
    });
  };

  const moveCard = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setBoard((prev) => {
      const sourceCol = prev.columns[source.droppableId];
      const destCol = prev.columns[destination.droppableId];

      if (!sourceCol || !destCol) return prev;

      if (source.droppableId === destination.droppableId) {
        const updatedCardIds = Array.from(sourceCol.cardIds);
        updatedCardIds.splice(source.index, 1);
        updatedCardIds.splice(destination.index, 0, draggableId);

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceCol.id]: {
              ...sourceCol,
              cardIds: updatedCardIds,
            },
          },
        };
      }

      const sourceCardIds = Array.from(sourceCol.cardIds);
      sourceCardIds.splice(source.index, 1);

      const destCardIds = Array.from(destCol.cardIds);
      destCardIds.splice(destination.index, 0, draggableId);

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [sourceCol.id]: {
            ...sourceCol,
            cardIds: sourceCardIds,
          },
          [destCol.id]: {
            ...destCol,
            cardIds: destCardIds,
          },
        },
      };
    });
  };

  return {
    board,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
  };
}
