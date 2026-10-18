'use client';

import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useKanban } from '@/hooks/useKanban';
import { Header } from './Header';
import { Column } from './Column';
import { AddCardModal } from './AddCardModal';

export function Board() {
  const { board, renameColumn, addCard, deleteCard, moveCard } = useKanban();
  const [activeModalColumnId, setActiveModalColumnId] = useState<string | null>(null);

  const totalCards = Object.keys(board.cards).length;
  const totalColumns = board.columnOrder.length;

  const activeColumn = activeModalColumnId ? board.columns[activeModalColumnId] : null;

  return (
    <div className="app-container" data-testid="kanban-app">
      <Header totalCards={totalCards} totalColumns={totalColumns} />

      <main className="board-main">
        <div className="board-viewport">
          <DragDropContext onDragEnd={moveCard}>
            <div className="board-columns-row" data-testid="board-columns-container">
              {board.columnOrder.map((colId) => {
                const column = board.columns[colId];
                if (!column) return null;

                const columnCards = column.cardIds
                  .map((cardId) => board.cards[cardId])
                  .filter(Boolean);

                return (
                  <Column
                    key={column.id}
                    column={column}
                    cards={columnCards}
                    onRename={renameColumn}
                    onDeleteCard={deleteCard}
                    onOpenAddModal={(id) => setActiveModalColumnId(id)}
                  />
                );
              })}
            </div>
          </DragDropContext>
        </div>
      </main>

      <AddCardModal
        isOpen={Boolean(activeModalColumnId)}
        columnTitle={activeColumn?.title || ''}
        onClose={() => setActiveModalColumnId(null)}
        onSubmit={(title, details) => {
          if (activeModalColumnId) {
            addCard(activeModalColumnId, title, details);
          }
        }}
      />
    </div>
  );
}
