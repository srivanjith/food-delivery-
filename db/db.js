import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

export async function getData() {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { users: [], restaurants: [], foodItems: [], orders: [], reviews: [] };
  }
}

export async function saveData(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to db.json:', error);
    return false;
  }
}
