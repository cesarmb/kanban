# Kanban Board MVP

Aplicacion web para la gestion de proyectos estilo Kanban en un solo tablero.

## Caracteristicas

- Tablero unico con 5 columnas fijas renombrables.
- Tarjetas con titulo y detalles.
- Arrastrar y soltar (Drag and Drop) entre columnas y reordenamiento.
- Creacion y eliminacion de tarjetas.
- Estado en memoria del cliente inicializado con datos de ejemplo.
- Diseno con Vanilla CSS siguiendo la paleta de colores corporativa.

## Requisitos

- Node.js 20+
- npm

## Instalacion y ejecucion

```bash
cd frontend
npm install
npm run dev
```

La aplicacion estara disponible en http://localhost:3000.

## Pruebas

Ejecutar pruebas unitarias:
```bash
cd frontend
npm run test
```

Ejecutar pruebas de integracion con Playwright:
```bash
cd frontend
npm run test:e2e
```

## Compilacion

```bash
cd frontend
npm run build
```
