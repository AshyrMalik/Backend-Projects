// utils/fileProcessor.js
const xlsx = require('xlsx');

const normalizeHeader = (header) => {
  // Remove extra spaces and convert to lowercase for comparison
  return header.trim().toLowerCase().replace(/\s+/g, '');
};

const processExcelFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet, { 
      raw: true, 
      defval: null,
      header: 'A'
    });
    
    // Get headers from first row
    const headers = {};
    Object.keys(rawData[0]).forEach(key => {
      headers[key] = rawData[0][key];
    });
    
    // Remove the header row and map the data with actual headers
    const data = rawData.slice(1).map(row => {
      const mappedRow = {};
      Object.keys(row).forEach(key => {
        mappedRow[headers[key]] = row[key];
      });
      return mappedRow;
    });
    
    console.log('Processed headers:', headers);
    console.log('First data row:', data[0]);
    
    return data;
  } catch (error) {
    throw new Error(`Error processing excel file: ${error.message}`);
  }
};

const cleanNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = Number(String(value).replace(/[^0-9.-]/g, ''));
  return isNaN(cleaned) ? 0 : cleaned;
};

module.exports = {
  processExcelFile,
  cleanNumber,
  normalizeHeader
};