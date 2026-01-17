import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export interface ExportColumn {
  key: string;
  label: string;
  formatter?: (value: any) => string;
}

export interface ExportData {
  [key: string]: any;
}

/**
 * Export data to PDF format
 * @param data - Array of data objects to export
 * @param columns - Column definitions with keys, labels, and formatters
 * @param filename - Name of the exported file (without extension)
 * @param title - Optional title for the PDF document
 */
export function exportToPDF(
  data: ExportData[],
  columns: ExportColumn[],
  filename: string,
  title?: string
): void {
  const doc = new jsPDF();

  // Add title if provided
  if (title) {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, 15);
    
    // Add export date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 22);
  }

  // Prepare table data
  const tableData = data.map((row) =>
    columns.map((col) => {
      const value = row[col.key];
      return col.formatter ? col.formatter(value) : value?.toString() || "";
    })
  );

  // Get column headers
  const headers = columns.map((col) => col.label);

  // Calculate starting Y position
  const startY = title ? 30 : 20;

  // Add table using autoTable
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [30, 41, 59], // Dark gray-blue
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Light gray
    },
    margin: { top: startY, left: 14, right: 14 },
    theme: "striped",
  });

  // Save the PDF
  doc.save(`${filename}.pdf`);
}

/**
 * Export data to Excel format
 * @param data - Array of data objects to export
 * @param columns - Column definitions with keys, labels, and formatters
 * @param filename - Name of the exported file (without extension)
 * @param sheetName - Optional sheet name (default: "Sheet1")
 */
export function exportToExcel(
  data: ExportData[],
  columns: ExportColumn[],
  filename: string,
  sheetName: string = "Sheet1"
): void {
  // Prepare worksheet data
  const worksheetData = [
    // Header row
    columns.map((col) => col.label),
    // Data rows
    ...data.map((row) =>
      columns.map((col) => {
        const value = row[col.key];
        return col.formatter ? col.formatter(value) : value?.toString() || "";
      })
    ),
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for better readability
  const columnWidths = columns.map((col) => ({
    wch: Math.max(col.label.length, 15),
  }));
  worksheet["!cols"] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Write file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for export
 */
export function formatDateForExport(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Format date and time for export
 */
export function formatDateTimeForExport(
  dateString: string | null | undefined
): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}
