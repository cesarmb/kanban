import { BoardState } from '@/types/kanban';

export const initialData: BoardState = {
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'Por Hacer',
      cardIds: ['card-1', 'card-2'],
    },
    'col-2': {
      id: 'col-2',
      title: 'En Analisis',
      cardIds: ['card-3'],
    },
    'col-3': {
      id: 'col-3',
      title: 'En Progreso',
      cardIds: ['card-4', 'card-5'],
    },
    'col-4': {
      id: 'col-4',
      title: 'En Revision',
      cardIds: ['card-6'],
    },
    'col-5': {
      id: 'col-5',
      title: 'Completado',
      cardIds: ['card-7'],
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Definir arquitectura de microservicios',
      details: 'Documentar contratos de API OpenAPI y diagramas de flujo para modulos principales.',
    },
    'card-2': {
      id: 'card-2',
      title: 'Migrar base de datos a PostgreSQL',
      details: 'Ejecutar planes de migracion en staging y verificar indices de tablas criticas.',
    },
    'card-3': {
      id: 'card-3',
      title: 'Auditoria de accesibilidad y contrastes',
      details: 'Validar estandares WCAG 2.1 en paleta de colores y componentes interactivos.',
    },
    'card-4': {
      id: 'card-4',
      title: 'Disenar sistema de componentes',
      details: 'Estandarizar botones, modales, tarjetas y variables de diseno en CSS.',
    },
    'card-5': {
      id: 'card-5',
      title: 'Implementar autenticacion multifactor',
      details: 'Integrar soporte para codigos de autenticador de un solo uso y claves de seguridad.',
    },
    'card-6': {
      id: 'card-6',
      title: 'Optimizar tiempo de carga inicial',
      details: 'Configurar division de paquetes y prefetching de recursos criticos.',
    },
    'card-7': {
      id: 'card-7',
      title: 'Automatizar pruebas continuas en CI',
      details: 'Configurar ejecucion automatizada de pruebas unitarias y de integracion.',
    },
  },
};
