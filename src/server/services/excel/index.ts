import ExcelJS from 'exceljs';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export interface CreateExcelParams {
  sheetName: string;
  columns: ExcelColumn[];
  data: Record<string, any>[];
}

export interface ReadExcelParams {
  buffer: Buffer;
  sheetIndex?: number;
  sheetName?: string;
}

/**
 * Crear archivo Excel desde datos
 */
export async function createExcel({ sheetName, columns, data }: CreateExcelParams): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Configurar columnas
  worksheet.columns = columns;

  // Estilo del encabezado
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2A7455' }, // Verde Lycsa
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Agregar datos
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Ajustar ancho de columnas automáticamente
  worksheet.columns.forEach((column) => {
    if (!column.width) {
      let maxLength = 10;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = Math.min(maxLength + 2, 50);
    }
  });

  // Generar buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Leer archivo Excel y convertir a JSON
 */
export async function readExcel({ buffer, sheetIndex = 0, sheetName }: ReadExcelParams): Promise<Record<string, any>[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer.buffer as ArrayBuffer);

  // Seleccionar hoja
  const worksheet = sheetName
    ? workbook.getWorksheet(sheetName)
    : workbook.worksheets[sheetIndex];

  if (!worksheet) {
    throw new Error('Hoja de cálculo no encontrada');
  }

  const data: Record<string, any>[] = [];
  const headers: string[] = [];

  // Obtener encabezados (primera fila)
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber - 1] = cell.value?.toString() ?? '';
  });

  // Procesar filas
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Saltar encabezados

    const rowData: Record<string, any> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        rowData[header] = cell.value;
      }
    });

    data.push(rowData);
  });

  return data;
}

/**
 * Validar estructura de Excel
 * Verifica que las columnas requeridas existan
 */
export async function validateExcelStructure(
  buffer: Buffer,
  requiredColumns: string[],
  sheetIndex = 0
): Promise<{ valid: boolean; missingColumns: string[] }> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer.buffer as ArrayBuffer);

  const worksheet = workbook.worksheets[sheetIndex];
  if (!worksheet) {
    return { valid: false, missingColumns: requiredColumns };
  }

  const headers: string[] = [];
  worksheet.getRow(1).eachCell((cell) => {
    headers.push(cell.value?.toString() ?? '');
  });

  const missingColumns = requiredColumns.filter(
    (col) => !headers.includes(col)
  );

  return {
    valid: missingColumns.length === 0,
    missingColumns,
  };
}

/**
 * Convertir datos a formato Excel y obtener buffer
 * Útil para exportaciones rápidas
 */
export async function dataToExcelBuffer(
  data: Record<string, any>[],
  sheetName = 'Datos'
): Promise<Buffer> {
  if (data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Generar columnas desde el primer registro
  const columns: ExcelColumn[] = Object.keys(data[0]).map((key) => ({
    header: key,
    key: key,
  }));

  return createExcel({ sheetName, columns, data });
}

/**
 * Crear Excel con múltiples hojas
 */
export async function createMultiSheetExcel(
  sheets: Array<{ name: string; columns: ExcelColumn[]; data: Record<string, any>[] }>
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  sheets.forEach(({ name, columns, data }) => {
    const worksheet = workbook.addWorksheet(name);
    worksheet.columns = columns;

    // Estilo del encabezado
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2A7455' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Agregar datos
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
      if (!column.width) {
        column.width = 15;
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
