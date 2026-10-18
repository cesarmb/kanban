import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKanban } from '@/hooks/useKanban';
import { BoardState } from '@/types/kanban';

const testInitialState: BoardState = {
  columns: {
    'col-1': { id: 'col-1', title: 'Por Hacer', cardIds: ['card-1'] },
    'col-2': { id: 'col-2', title: 'En Progreso', cardIds: ['card-2'] },
  },
  columnOrder: ['col-1', 'col-2'],
  cards: {
    'card-1': { id: 'card-1', title: 'Tarea 1', details: 'Detalles 1' },
    'card-2': { id: 'card-2', title: 'Tarea 2', details: 'Detalles 2' },
  },
};

describe('useKanban hook', () => {
  it('inicializa con el estado por defecto o provisto', () => {
    const { result } = renderHook(() => useKanban(testInitialState));
    expect(result.current.board.columnOrder).toHaveLength(2);
    expect(result.current.board.columns['col-1'].title).toBe('Por Hacer');
    expect(result.current.board.cards['card-1'].title).toBe('Tarea 1');
  });

  it('permite renombrar una columna existente', () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.renameColumn('col-1', 'Backlog Refinado');
    });

    expect(result.current.board.columns['col-1'].title).toBe('Backlog Refinado');
  });

  it('ignora renombramientos con cadenas vacias o espacios en blanco', () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.renameColumn('col-1', '   ');
    });

    expect(result.current.board.columns['col-1'].title).toBe('Por Hacer');
  });

  it('agrega una nueva tarjeta a una columna especifica', () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.addCard('col-1', 'Nueva Tarea', 'Descripcion detallada');
    });

    const col1CardIds = result.current.board.columns['col-1'].cardIds;
    expect(col1CardIds).toHaveLength(2);

    const newCardId = col1CardIds[1];
    expect(result.current.board.cards[newCardId]).toEqual({
      id: newCardId,
      title: 'Nueva Tarea',
      details: 'Descripcion detallada',
    });
  });

  it('elimina una tarjeta existente de la columna y del mapa de tarjetas', () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.deleteCard('card-1', 'col-1');
    });

    expect(result.current.board.columns['col-1'].cardIds).toEqual([]);
    expect(result.current.board.cards['card-1']).toBeUndefined();
  });

  it('mueve una tarjeta entre columnas diferentes con moveCard', () => {
    const { result } = renderHook(() => useKanban(testInitialState));

    act(() => {
      result.current.moveCard({
        draggableId: 'card-1',
        source: { droppableId: 'col-1', index: 0 },
        destination: { droppableId: 'col-2', index: 1 },
        type: 'DEFAULT',
        mode: 'SNAP',
        reason: 'DROP',
        combine: null,
      });
    });

    expect(result.current.board.columns['col-1'].cardIds).toEqual([]);
    expect(result.current.board.columns['col-2'].cardIds).toEqual(['card-2', 'card-1']);
  });

  it('reordena tarjetas dentro de la misma columna con moveCard', () => {
    const stateWithMultipleCards: BoardState = {
      columns: {
        'col-1': { id: 'col-1', title: 'Por Hacer', cardIds: ['card-1', 'card-2'] },
      },
      columnOrder: ['col-1'],
      cards: {
        'card-1': { id: 'card-1', title: 'Tarea 1', details: 'D1' },
        'card-2': { id: 'card-2', title: 'Tarea 2', details: 'D2' },
      },
    };

    const { result } = renderHook(() => useKanban(stateWithMultipleCards));

    act(() => {
      result.current.moveCard({
        draggableId: 'card-1',
        source: { droppableId: 'col-1', index: 0 },
        destination: { droppableId: 'col-1', index: 1 },
        type: 'DEFAULT',
        mode: 'SNAP',
        reason: 'DROP',
        combine: null,
      });
    });

    expect(result.current.board.columns['col-1'].cardIds).toEqual(['card-2', 'card-1']);
  });
});
