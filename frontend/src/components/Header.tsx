'use client';

import React from 'react';

interface HeaderProps {
  totalCards: number;
  totalColumns: number;
}

export function Header({ totalCards, totalColumns }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-logo-mark" aria-hidden="true">
            K
          </div>
          <div className="brand-info">
            <h1>
              Kanban Flow
              <span className="badge-tag">Tablero Activo</span>
            </h1>
            <p className="header-subtitle">
              Gestion de proyectos agil en tablero unico
            </p>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{totalColumns}</span>
            <span className="stat-label">Columnas</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalCards}</span>
            <span className="stat-label">Tarjetas</span>
          </div>
        </div>
      </div>
    </header>
  );
}
