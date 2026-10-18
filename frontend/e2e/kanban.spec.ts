import { test, expect } from '@playwright/test';

test.describe('MVP Tablero Kanban - Pruebas de Integracion E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('carga inicial del tablero con encabezado, 5 columnas y datos de ejemplo', async ({ page }) => {
    // Verificar encabezado y estadisticas
    await expect(page.getByText('Kanban Flow')).toBeVisible();
    await expect(page.getByText('Tablero Activo')).toBeVisible();
    await expect(page.getByText('5')).toBeVisible();
    await expect(page.getByText('Columnas')).toBeVisible();

    // Verificar las 5 columnas fijas
    const columns = [
      'Por Hacer',
      'En Analisis',
      'En Progreso',
      'En Revision',
      'Completado',
    ];

    for (const colTitle of columns) {
      await expect(page.getByRole('heading', { name: colTitle, exact: true })).toBeVisible();
    }

    // Verificar presencia de tarjetas de ejemplo iniciales
    await expect(page.getByText('Definir arquitectura de microservicios')).toBeVisible();
    await expect(page.getByText('Migrar base de datos a PostgreSQL')).toBeVisible();
    await expect(page.getByText('Auditoria de accesibilidad y contrastes')).toBeVisible();
  });

  test('permite renombrar una columna mediante interaccion en linea', async ({ page }) => {
    const colTitleButton = page.getByTestId('column-title-display-col-1');
    await expect(colTitleButton).toBeVisible();
    await colTitleButton.click();

    const input = page.getByTestId('column-title-input-col-1');
    await expect(input).toBeVisible();
    await input.fill('Backlog Principal');
    await input.press('Enter');

    // Verificar nuevo titulo
    await expect(page.getByTestId('column-title-col-1')).toHaveText('Backlog Principal');
  });

  test('permite crear una nueva tarjeta y visualizarla en la columna correspondiente', async ({ page }) => {
    // Abrir modal de creacion en la columna 1
    const addBtn = page.getByTestId('add-card-btn-col-1');
    await addBtn.click();

    // Validar modal
    const modal = page.getByTestId('add-card-modal');
    await expect(modal).toBeVisible();

    const titleInput = page.getByTestId('card-title-input');
    const detailsInput = page.getByTestId('card-details-input');
    const submitBtn = page.getByTestId('submit-add-card-btn');

    await titleInput.fill('Implementar Pruebas E2E');
    await detailsInput.fill('Cobertura integral con Playwright para el tablero Kanban.');
    await submitBtn.click();

    // Validar cierre de modal
    await expect(modal).not.toBeVisible();

    // Validar aparicion de la tarjeta
    await expect(page.getByText('Implementar Pruebas E2E')).toBeVisible();
    await expect(page.getByText('Cobertura integral con Playwright para el tablero Kanban.')).toBeVisible();
  });

  test('permite eliminar una tarjeta existente', async ({ page }) => {
    // Validar que la tarjeta existe inicialmente
    const cardTitle = 'Definir arquitectura de microservicios';
    await expect(page.getByText(cardTitle)).toBeVisible();

    // Hacer clic en boton eliminar
    const deleteBtn = page.getByTestId('delete-card-card-1');
    await deleteBtn.click();

    // Validar que ya no existe
    await expect(page.getByText(cardTitle)).not.toBeVisible();
  });

  test('cierre de modal con boton cancelar y con tecla Escape', async ({ page }) => {
    const addBtn = page.getByTestId('add-card-btn-col-2');
    
    // Probar boton cancelar
    await addBtn.click();
    await expect(page.getByTestId('add-card-modal')).toBeVisible();
    await page.getByTestId('cancel-add-card-btn').click();
    await expect(page.getByTestId('add-card-modal')).not.toBeVisible();

    // Probar tecla Escape
    await addBtn.click();
    await expect(page.getByTestId('add-card-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('add-card-modal')).not.toBeVisible();
  });

  test('permite mover una tarjeta entre columnas mediante arrastre y soltar', async ({ page }) => {
    const card = page.getByTestId('card-card-1');
    await expect(card).toBeVisible();

    // Comprobar que inicialmente esta en la primera columna
    const col1Cards = page.getByTestId('column-cards-col-1');
    await expect(col1Cards.getByTestId('card-card-1')).toBeVisible();

    const targetColumn = page.getByTestId('column-cards-col-2');
    const cardBox = await card.boundingBox();
    const targetBox = await targetColumn.boundingBox();

    expect(cardBox).not.toBeNull();
    expect(targetBox).not.toBeNull();

    if (cardBox && targetBox) {
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      // Mover superando el umbral de arrastre
      await page.mouse.move(cardBox.x + cardBox.width / 2 + 15, cardBox.y + cardBox.height / 2 + 15, { steps: 5 });
      // Arrastrar hacia la columna destino
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 40, { steps: 25 });
      await page.waitForTimeout(200);
      await page.mouse.up();
    }

    // Comprobar que ahora esta en la columna 2
    const col2Cards = page.getByTestId('column-cards-col-2');
    await expect(col2Cards.getByTestId('card-card-1')).toBeVisible();
  });
});
