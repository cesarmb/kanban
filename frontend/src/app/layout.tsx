import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kanban Flow - Gestion Profesional de Proyectos',
  description: 'Tablero Kanban minimalista, agil y eficiente para organizacion de flujos de trabajo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
