import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';

describe('Header component', () => {
  it('muestra el titulo, indicador y estadisticas correctamente', () => {
    render(<Header totalCards={7} totalColumns={5} />);

    expect(screen.getByText('Kanban Flow')).toBeInTheDocument();
    expect(screen.getByText('Tablero Activo')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Columnas')).toBeInTheDocument();
    expect(screen.getByText('Tarjetas')).toBeInTheDocument();
  });
});
