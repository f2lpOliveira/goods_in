export function generateCSV(data, filename) {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = filename;

  link.click();

  URL.revokeObjectURL(link.href);
}
