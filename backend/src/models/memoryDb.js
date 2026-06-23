import { hashPassword } from '../utils/hash.js';
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = resolve(__dirname, '../../db.json');

export const db = {
  users: [],
  projects: [],
  tasks: []
};

// Load database from file if exists
const loadDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      db.users = parsed.users || [];
      db.projects = parsed.projects || [];
      db.tasks = parsed.tasks || [];
    }
  } catch (err) {
    console.error("Failed to load local db.json:", err);
  }
};

export const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to save local db.json:", err);
  }
};

// Initialize and Seed admin user if empty
(async () => {
  loadDb();
  if (db.users.length === 0) {
    db.users.push({
      id: 1,
      email: 'admin@gmail.com',
      password: await hashPassword('admin@enter')
    });
    saveDb();
  }
})();
