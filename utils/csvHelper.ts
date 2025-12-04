import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Reads a CSV file and returns an array of objects.
 * @param relativePath Path to the CSV file relative to the project root.
 */
export function readCsv(relativePath: string): any[] {
  const csvPath = process.env.CSV_PATH 
    ? path.resolve(process.env.CSV_PATH) 
    : path.resolve(__dirname, '..', relativePath);

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found at ${csvPath}`);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
}
