'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  columnTitle: string;
  onClose: () => void;
  onSubmit: (title: string, details: string) => void;
}

export function AddCardModal({
  isOpen,
  columnTitle,
  onClose,
  onSubmit,
}: AddCardModalProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDetails('');
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), details.trim());
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      data-testid="add-card-modal-overlay"
      role="presentation"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-heading"
        data-testid="add-card-modal"
      >
        <div className="modal-header">
          <h2 id="modal-heading" className="modal-title">
            Nueva Tarjeta en &ldquo;{columnTitle}&rdquo;
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
            data-testid="close-modal-btn"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="card-title-field" className="form-label">
                Titulo de la tarjeta *
              </label>
              <input
                ref={titleInputRef}
                id="card-title-field"
                type="text"
                className="form-input"
                placeholder="Escribe el titulo..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                data-testid="card-title-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="card-details-field" className="form-label">
                Detalles
              </label>
              <textarea
                id="card-details-field"
                className="form-textarea"
                placeholder="Escribe los detalles o descripcion..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                data-testid="card-details-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              data-testid="cancel-add-card-btn"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!title.trim()}
              data-testid="submit-add-card-btn"
            >
              Crear Tarjeta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
