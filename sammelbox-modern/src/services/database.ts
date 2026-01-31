import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    // Load SQLite database - creates if not exists
    db = await Database.load('sqlite:demo.db');

    // Enable foreign keys
    await db.execute('PRAGMA foreign_keys = ON');

    // Create demo table if not exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS demo_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  }
  return db;
}

export interface DemoItem {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export async function getAllItems(): Promise<DemoItem[]> {
  const db = await getDatabase();
  return db.select<DemoItem[]>('SELECT * FROM demo_items ORDER BY id DESC');
}

export async function addItem(name: string, description: string): Promise<number> {
  const db = await getDatabase();
  const result = await db.execute(
    'INSERT INTO demo_items (name, description) VALUES ($1, $2)',
    [name, description || null]
  );
  return result.lastInsertId;
}

export async function deleteItem(id: number): Promise<void> {
  const db = await getDatabase();
  await db.execute('DELETE FROM demo_items WHERE id = $1', [id]);
}

export async function updateItem(id: number, name: string, description: string): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    'UPDATE demo_items SET name = $1, description = $2 WHERE id = $3',
    [name, description || null, id]
  );
}
