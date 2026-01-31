# Sammelbox Modernization Plan
## Tauri 2.0 + React + TypeScript Implementation

**Document Version:** 2.0
**Date:** January 2026
**Target:** Complete rewrite with 100% database compatibility

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Layer](#4-database-layer)
5. [Backend Architecture (Rust/Tauri)](#5-backend-architecture-rusttauri)
6. [Frontend Architecture (React)](#6-frontend-architecture-react)
7. [Feature Implementation Map](#7-feature-implementation-map)
8. [Data Migration Strategy](#8-data-migration-strategy)
9. [Build & Deployment](#9-build--deployment)
10. [Development Roadmap](#10-development-roadmap)
11. [Testing Strategy](#11-testing-strategy)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

### Goals

- **Complete rewrite** of Sammelbox in a modern tech stack
- **100% database compatibility** with existing SQLite databases
- **Cross-platform support** for Windows, macOS, Linux, **iOS, and Android**
- **Modern UI/UX** with responsive design and dark mode
- **Maintainable codebase** with TypeScript throughout (minimal Rust)

### Why Tauri 2.0 + React + TypeScript?

| Benefit | Description |
|---------|-------------|
| **Small Bundle** | ~10-15MB vs 150MB+ for Electron |
| **Cross-Platform** | Desktop (Win/Mac/Linux) + Mobile (iOS/Android) |
| **TypeScript-First** | 95% TypeScript, minimal Rust = easier maintenance |
| **Type Safety** | End-to-end type safety with shared types |
| **Modern UI** | React ecosystem with rich component libraries |
| **Security** | Tauri's security-first architecture |
| **Native SQLite** | Direct database access via Tauri SQL plugin |

### Architecture Philosophy

**TypeScript-Heavy Approach**: Most business logic lives in TypeScript. Rust is only used for:
- Image thumbnail generation (native performance)
- File system operations that need native access
- Any CPU-intensive operations

This makes the codebase accessible to web developers while keeping bundle sizes small.

---

## 2. Technology Stack

### Core Technologies

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (TypeScript)                    │
├─────────────────────────────────────────────────────────────┤
│  React 18+            UI Framework                          │
│  TypeScript 5+        Type-safe JavaScript                  │
│  Vite 5+              Build tool & dev server               │
│  TailwindCSS 3+       Utility-first CSS                     │
│  React Router 6+      Client-side routing                   │
│  TanStack Query       Server state management               │
│  Zustand              Client state management               │
│  React Hook Form      Form handling                         │
│  Zod                  Schema validation                     │
└─────────────────────────────────────────────────────────────┘
        │                                           │
        │  Tauri SQL Plugin                         │  Tauri IPC
        │  (TypeScript → SQLite)                    │  (for Rust commands)
        ▼                                           ▼
┌──────────────────────────────┐  ┌────────────────────────────┐
│      DATABASE LAYER          │  │   RUST BACKEND (Minimal)   │
│      (TypeScript)            │  │                            │
├──────────────────────────────┤  ├────────────────────────────┤
│  @tauri-apps/plugin-sql      │  │  Image processing only     │
│  - All CRUD operations       │  │  - Thumbnail generation    │
│  - Search queries            │  │  - Image resizing          │
│  - Schema management         │  │                            │
└──────────────────────────────┘  └────────────────────────────┘
        │                                           │
        └─────────────────┬─────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       STORAGE                                │
├─────────────────────────────────────────────────────────────┤
│  SQLite 3.x         Embedded database (existing format)     │
│  File System        Images stored as files (not in DB)      │
└─────────────────────────────────────────────────────────────┘
```

### Platform Support Matrix

| Platform | Status | Bundle Size | Notes |
|----------|--------|-------------|-------|
| **Windows** | Full | ~12 MB | Uses WebView2 (Edge) |
| **macOS** | Full | ~10 MB | Uses WebKit (built-in) |
| **Linux** | Full | ~15 MB | Uses WebKitGTK |
| **iOS** | Full | ~15 MB | Uses WKWebView |
| **Android** | Full | ~20 MB | Uses WebView |

### Version Requirements

| Technology | Minimum Version | Recommended |
|------------|-----------------|-------------|
| Node.js | 18.x | 20.x LTS |
| Rust | 1.70 | 1.75+ |
| Tauri | 2.0 | 2.x latest |
| React | 18.0 | 18.2+ |
| TypeScript | 5.0 | 5.3+ |

### Development Tools

- **IDE:** VS Code with TypeScript + Tauri extensions
- **Package Manager:** pnpm (faster, disk-efficient)
- **Linting:** ESLint + Prettier
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **Rust (minimal):** Only for image service

---

## 3. Project Structure

```
sammelbox-modern/
├── src-tauri/                    # Rust backend (MINIMAL)
│   ├── Cargo.toml                # Rust dependencies
│   ├── tauri.conf.json           # Tauri configuration
│   ├── capabilities/             # Permission capabilities
│   ├── icons/                    # App icons
│   └── src/
│       ├── main.rs               # Entry point + plugin registration
│       ├── lib.rs                # Library root
│       └── commands/
│           ├── mod.rs
│           └── images.rs         # ONLY Rust code: thumbnail generation
│
├── src/                          # React frontend (ALL BUSINESS LOGIC)
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Root component
│   ├── components/               # Reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── ...
│   │   ├── layout/               # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MainContent.tsx
│   │   ├── albums/               # Album-specific components
│   │   │   ├── AlbumList.tsx
│   │   │   ├── AlbumCard.tsx
│   │   │   ├── AlbumForm.tsx
│   │   │   └── AlbumSettings.tsx
│   │   ├── items/                # Item components
│   │   │   ├── ItemGrid.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── ItemDetail.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   └── ItemTable.tsx
│   │   ├── search/               # Search components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── AdvancedSearch.tsx
│   │   │   └── SavedSearches.tsx
│   │   └── pictures/             # Image components
│   │       ├── ImageGallery.tsx
│   │       ├── ImageUploader.tsx
│   │       └── ImageViewer.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAlbums.ts
│   │   ├── useItems.ts
│   │   ├── useSearch.ts
│   │   └── useTauriCommand.ts
│   ├── stores/                   # Zustand stores
│   │   ├── albumStore.ts
│   │   ├── uiStore.ts
│   │   └── settingsStore.ts
│   ├── services/                 # Frontend services
│   │   ├── database.ts           # SQLite via @tauri-apps/plugin-sql
│   │   ├── albums.ts             # Album operations (TypeScript)
│   │   ├── items.ts              # Item operations (TypeScript)
│   │   ├── search.ts             # Search logic (TypeScript)
│   │   ├── pictures.ts           # Picture management
│   │   ├── import-export.ts      # CSV/HTML import/export
│   │   └── images.ts             # Calls Rust for thumbnails only
│   ├── types/                    # TypeScript types
│   │   ├── album.ts
│   │   ├── field.ts
│   │   ├── item.ts
│   │   └── api.ts
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx
│   │   ├── AlbumPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── SyncPage.tsx
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── styles/                   # Global styles
│       └── globals.css
│
├── public/                       # Static assets
├── tests/                        # Test files
│   ├── e2e/                      # End-to-end tests
│   └── unit/                     # Unit tests
├── package.json                  # Node dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
├── tailwind.config.js            # Tailwind config
└── README.md
```

---

## 4. Database Layer

### 4.1 Schema Compatibility

The new application must read/write the **exact same SQLite schema** as the original Java application.

#### Master Table: `album_master_table`

```sql
CREATE TABLE IF NOT EXISTS album_master_table (
    id INTEGER PRIMARY KEY,
    album_name TEXT,
    album_table_name TEXT,
    has_pictures TEXT  -- 'YES', 'NO', or 'UNKNOWN'
);
```

#### Dynamic Album Tables: `[album_name]`

```sql
CREATE TABLE "[album_name]" (
    id INTEGER PRIMARY KEY,
    -- User-defined columns of various types --
    content_version TEXT,           -- UUID for change tracking
    typeinfo INTEGER,               -- FK to typeinfo table
    FOREIGN KEY(typeinfo) REFERENCES "[album_name]_typeinfo"(id)
);
```

#### Type Info Tables: `[album_name]_typeinfo`

```sql
CREATE TABLE "[album_name]_typeinfo" (
    id INTEGER PRIMARY KEY,
    -- Column names with their FieldType as TEXT --
    schema_version TEXT             -- UUID for schema tracking
);
```

#### Picture Tables: `[album_name]_pictures`

```sql
CREATE TABLE "[album_name]_pictures" (
    id INTEGER PRIMARY KEY,
    original_picture_filename TEXT,
    thumbnail_picture_filename TEXT,
    album_item_foreign_key INTEGER
);
```

### 4.2 Field Type Mapping

| Original FieldType | SQLite Type | TypeScript Type |
|-------------------|-------------|-----------------|
| ID | INTEGER | number |
| TEXT | TEXT | string |
| DECIMAL | REAL | number |
| DATE | TEXT | string (ISO 8601) |
| TIME | TEXT | string |
| UUID | TEXT | string |
| STAR_RATING | INTEGER | number (0-5) |
| URL | TEXT | string |
| INTEGER | INTEGER | number |
| OPTION | TEXT | 'YES' \| 'NO' \| 'UNKNOWN' |

### 4.3 TypeScript Database Models

```typescript
// src/types/album.ts

export interface Album {
  id: number;
  albumName: string;
  albumTableName: string;
  hasPictures: OptionType;
}

export type OptionType = 'YES' | 'NO' | 'UNKNOWN';

export interface AlbumSchema {
  fields: FieldDefinition[];
  schemaVersion: string;
}

export interface FieldDefinition {
  name: string;
  fieldType: FieldType;
  quickSearchable: boolean;
}

export type FieldType =
  | 'ID'
  | 'TEXT'
  | 'DECIMAL'
  | 'DATE'
  | 'TIME'
  | 'UUID'
  | 'STAR_RATING'
  | 'URL'
  | 'INTEGER'
  | 'OPTION';
```

```typescript
// src/types/item.ts

export interface AlbumItem {
  id: number;
  fields: FieldValue[];
  contentVersion: string;
  pictures: Picture[];
}

export interface FieldValue {
  name: string;
  value: unknown;
  fieldType: FieldType;
}

export interface Picture {
  id: number;
  originalFilename: string;
  thumbnailFilename: string;
}
```

### 4.4 Database Connection (TypeScript via Tauri SQL Plugin)

```typescript
// src/services/database.ts

import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    // Connect to SQLite database (creates if not exists)
    db = await Database.load('sqlite:sammelbox.db');

    // Enable foreign keys (matching original behavior)
    await db.execute('PRAGMA foreign_keys = ON');

    // Create master table if not exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS album_master_table (
        id INTEGER PRIMARY KEY,
        album_name TEXT,
        album_table_name TEXT,
        has_pictures TEXT
      )
    `);
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
```

---

## 5. Backend Architecture (Minimal Rust)

### 5.1 Philosophy: TypeScript-First

Unlike typical Tauri apps that put business logic in Rust, we use TypeScript for everything except image processing. This means:

- **Database operations**: TypeScript via `@tauri-apps/plugin-sql`
- **Search logic**: TypeScript
- **Import/Export**: TypeScript
- **Image thumbnails**: Rust (for native performance)

### 5.2 Rust Code (Minimal - Image Processing Only)

```rust
// src-tauri/src/main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::images::generate_thumbnail,
            commands::images::copy_and_rename_image,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```rust
// src-tauri/src/commands/images.rs

use image::GenericImageView;
use std::path::PathBuf;
use uuid::Uuid;

#[tauri::command]
pub async fn generate_thumbnail(
    source_path: String,
    dest_dir: String,
    size: u32,
) -> Result<String, String> {
    let source = PathBuf::from(&source_path);
    let dest = PathBuf::from(&dest_dir);

    // Generate unique filename (matching original format: uuid_timestamp.ext)
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis();
    let uuid = Uuid::new_v4();

    let extension = source
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("png");

    let thumbnail_filename = format!("{}_{}.{}", uuid, timestamp, extension);

    // Ensure directory exists
    std::fs::create_dir_all(&dest).map_err(|e| e.to_string())?;

    // Generate thumbnail
    let img = image::open(&source).map_err(|e| e.to_string())?;
    let thumbnail = img.thumbnail(size, size);
    let thumbnail_path = dest.join(&thumbnail_filename);
    thumbnail.save(&thumbnail_path).map_err(|e| e.to_string())?;

    Ok(thumbnail_filename)
}

#[tauri::command]
pub async fn copy_and_rename_image(
    source_path: String,
    dest_dir: String,
) -> Result<String, String> {
    let source = PathBuf::from(&source_path);
    let dest = PathBuf::from(&dest_dir);

    // Generate unique filename
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis();
    let uuid = Uuid::new_v4();

    let extension = source
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("png");

    let new_filename = format!("{}_{}.{}", uuid, timestamp, extension);

    // Ensure directory exists
    std::fs::create_dir_all(&dest).map_err(|e| e.to_string())?;

    // Copy file
    let dest_path = dest.join(&new_filename);
    std::fs::copy(&source, &dest_path).map_err(|e| e.to_string())?;

    Ok(new_filename)
}
```

### 5.3 Cargo.toml (Minimal Dependencies)

```toml
# src-tauri/Cargo.toml
[package]
name = "sammelbox"
version = "2.0.0"
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.0", features = [] }

[dependencies]
tauri = { version = "2.0", features = ["protocol-asset"] }
tauri-plugin-sql = { version = "2.0", features = ["sqlite"] }
tauri-plugin-fs = "2.0"
tauri-plugin-dialog = "2.0"
tauri-plugin-shell = "2.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
image = "0.25"
uuid = { version = "1.7", features = ["v4"] }

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
```

That's it! All other logic lives in TypeScript.

---

## 6. Frontend Architecture (React + TypeScript)

This is where **all business logic** lives. The frontend handles:
- All database operations via `@tauri-apps/plugin-sql`
- Search and filtering logic
- Import/Export functionality
- State management

### 6.1 Album Service (TypeScript - Full Implementation)

```typescript
// src/services/albums.ts

import { getDatabase } from './database';
import type { Album, AlbumSchema, FieldDefinition, FieldType } from '../types/album';
import { v4 as uuidv4 } from 'uuid';

// Sanitize album name to create valid table name
function sanitizeTableName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

// Map FieldType to SQLite type
function fieldTypeToSql(fieldType: FieldType): string {
  switch (fieldType) {
    case 'ID':
    case 'INTEGER':
    case 'STAR_RATING':
      return 'INTEGER';
    case 'DECIMAL':
      return 'REAL';
    default:
      return 'TEXT';
  }
}

export async function getAllAlbums(): Promise<Album[]> {
  const db = await getDatabase();
  const results = await db.select<Array<{
    id: number;
    album_name: string;
    album_table_name: string;
    has_pictures: string;
  }>>('SELECT * FROM album_master_table');

  return results.map(row => ({
    id: row.id,
    albumName: row.album_name,
    albumTableName: row.album_table_name,
    hasPictures: row.has_pictures as 'YES' | 'NO' | 'UNKNOWN',
  }));
}

export async function createAlbum(
  name: string,
  fields: FieldDefinition[],
  hasPictures: boolean
): Promise<Album> {
  const db = await getDatabase();
  const tableName = sanitizeTableName(name);
  const schemaVersion = uuidv4();

  // Build column definitions
  const columns = fields
    .map(f => `"${f.name}" ${fieldTypeToSql(f.fieldType)}`)
    .join(', ');

  // 1. Create main album table
  await db.execute(`
    CREATE TABLE "${tableName}" (
      id INTEGER PRIMARY KEY,
      ${columns ? columns + ',' : ''}
      content_version TEXT,
      typeinfo INTEGER
    )
  `);

  // 2. Create typeinfo table
  const typeinfoColumns = fields
    .map(f => `"${f.name}" TEXT`)
    .join(', ');

  await db.execute(`
    CREATE TABLE "${tableName}_typeinfo" (
      id INTEGER PRIMARY KEY,
      ${typeinfoColumns ? typeinfoColumns + ',' : ''}
      schema_version TEXT
    )
  `);

  // 3. Insert typeinfo row with field types
  const fieldNames = fields.map(f => `"${f.name}"`).join(', ');
  const fieldTypes = fields.map(f => `'${f.fieldType}'`).join(', ');

  await db.execute(`
    INSERT INTO "${tableName}_typeinfo"
    (${fieldNames ? fieldNames + ',' : ''} schema_version)
    VALUES (${fieldTypes ? fieldTypes + ',' : ''} '${schemaVersion}')
  `);

  // 4. Create pictures table if needed
  if (hasPictures) {
    await db.execute(`
      CREATE TABLE "${tableName}_pictures" (
        id INTEGER PRIMARY KEY,
        original_picture_filename TEXT,
        thumbnail_picture_filename TEXT,
        album_item_foreign_key INTEGER
      )
    `);
  }

  // 5. Register in master table
  const result = await db.execute(
    `INSERT INTO album_master_table (album_name, album_table_name, has_pictures)
     VALUES ($1, $2, $3)`,
    [name, tableName, hasPictures ? 'YES' : 'NO']
  );

  return {
    id: result.lastInsertId,
    albumName: name,
    albumTableName: tableName,
    hasPictures: hasPictures ? 'YES' : 'NO',
  };
}

export async function deleteAlbum(albumTableName: string): Promise<void> {
  const db = await getDatabase();

  // Drop all related tables
  await db.execute(`DROP TABLE IF EXISTS "${albumTableName}"`);
  await db.execute(`DROP TABLE IF EXISTS "${albumTableName}_typeinfo"`);
  await db.execute(`DROP TABLE IF EXISTS "${albumTableName}_pictures"`);

  // Remove from master table
  await db.execute(
    'DELETE FROM album_master_table WHERE album_table_name = $1',
    [albumTableName]
  );
}

export async function getAlbumSchema(albumTableName: string): Promise<AlbumSchema> {
  const db = await getDatabase();

  // Get typeinfo row
  const typeinfo = await db.select<Array<Record<string, string>>>(
    `SELECT * FROM "${albumTableName}_typeinfo" LIMIT 1`
  );

  if (typeinfo.length === 0) {
    return { fields: [], schemaVersion: '' };
  }

  const row = typeinfo[0];
  const fields: FieldDefinition[] = [];

  for (const [key, value] of Object.entries(row)) {
    if (key === 'id' || key === 'schema_version') continue;

    fields.push({
      name: key,
      fieldType: value as FieldType,
      quickSearchable: false, // TODO: Store this separately
    });
  }

  return {
    fields,
    schemaVersion: row.schema_version || '',
  };
}
```

### 6.2 Item Service (TypeScript - Full Implementation)

```typescript
// src/services/items.ts

import { getDatabase } from './database';
import type { AlbumItem, FieldValue, Picture } from '../types/item';
import { getAlbumSchema } from './albums';
import { v4 as uuidv4 } from 'uuid';

export async function getAlbumItems(
  albumTableName: string,
  limit?: number,
  offset?: number
): Promise<AlbumItem[]> {
  const db = await getDatabase();
  const schema = await getAlbumSchema(albumTableName);

  let sql = `SELECT * FROM "${albumTableName}" ORDER BY id DESC`;
  if (limit) sql += ` LIMIT ${limit}`;
  if (offset) sql += ` OFFSET ${offset}`;

  const rows = await db.select<Array<Record<string, unknown>>>(sql);

  return Promise.all(rows.map(async row => {
    const fields: FieldValue[] = schema.fields.map(field => ({
      name: field.name,
      value: row[field.name],
      fieldType: field.fieldType,
    }));

    // Load pictures
    const pictures = await getPicturesForItem(albumTableName, row.id as number);

    return {
      id: row.id as number,
      fields,
      contentVersion: (row.content_version as string) || '',
      pictures,
    };
  }));
}

export async function createItem(
  albumTableName: string,
  fields: FieldValue[]
): Promise<AlbumItem> {
  const db = await getDatabase();
  const contentVersion = uuidv4();

  const columnNames = fields.map(f => `"${f.name}"`).join(', ');
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
  const values = fields.map(f => f.value);

  const result = await db.execute(
    `INSERT INTO "${albumTableName}" (${columnNames}, content_version, typeinfo)
     VALUES (${placeholders}, $${fields.length + 1}, 1)`,
    [...values, contentVersion]
  );

  return {
    id: result.lastInsertId,
    fields,
    contentVersion,
    pictures: [],
  };
}

export async function updateItem(
  albumTableName: string,
  itemId: number,
  fields: FieldValue[]
): Promise<void> {
  const db = await getDatabase();
  const contentVersion = uuidv4();

  const setClauses = fields.map((f, i) => `"${f.name}" = $${i + 1}`).join(', ');
  const values = fields.map(f => f.value);

  await db.execute(
    `UPDATE "${albumTableName}"
     SET ${setClauses}, content_version = $${fields.length + 1}
     WHERE id = $${fields.length + 2}`,
    [...values, contentVersion, itemId]
  );
}

export async function deleteItem(
  albumTableName: string,
  itemId: number
): Promise<void> {
  const db = await getDatabase();

  // Delete associated pictures first
  await db.execute(
    `DELETE FROM "${albumTableName}_pictures" WHERE album_item_foreign_key = $1`,
    [itemId]
  );

  // Delete item
  await db.execute(
    `DELETE FROM "${albumTableName}" WHERE id = $1`,
    [itemId]
  );
}

async function getPicturesForItem(
  albumTableName: string,
  itemId: number
): Promise<Picture[]> {
  const db = await getDatabase();

  const rows = await db.select<Array<{
    id: number;
    original_picture_filename: string;
    thumbnail_picture_filename: string;
  }>>(
    `SELECT * FROM "${albumTableName}_pictures" WHERE album_item_foreign_key = $1`,
    [itemId]
  );

  return rows.map(row => ({
    id: row.id,
    originalFilename: row.original_picture_filename,
    thumbnailFilename: row.thumbnail_picture_filename,
  }));
}
```

### 6.3 Search Service (TypeScript - Full Implementation)

```typescript
// src/services/search.ts

import { getDatabase } from './database';
import type { AlbumItem } from '../types/item';
import { getAlbumItems } from './items';

export type SearchOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterOrEqual'
  | 'lessOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';

export interface SearchCriteria {
  field: string;
  operator: SearchOperator;
  value: string;
}

function operatorToSql(operator: SearchOperator, field: string, paramIndex: number): string {
  const placeholder = `$${paramIndex}`;
  switch (operator) {
    case 'equals':
      return `"${field}" = ${placeholder}`;
    case 'notEquals':
      return `"${field}" != ${placeholder}`;
    case 'contains':
      return `"${field}" LIKE '%' || ${placeholder} || '%'`;
    case 'startsWith':
      return `"${field}" LIKE ${placeholder} || '%'`;
    case 'endsWith':
      return `"${field}" LIKE '%' || ${placeholder}`;
    case 'greaterThan':
      return `"${field}" > ${placeholder}`;
    case 'lessThan':
      return `"${field}" < ${placeholder}`;
    case 'greaterOrEqual':
      return `"${field}" >= ${placeholder}`;
    case 'lessOrEqual':
      return `"${field}" <= ${placeholder}`;
    case 'isEmpty':
      return `("${field}" IS NULL OR "${field}" = '')`;
    case 'isNotEmpty':
      return `("${field}" IS NOT NULL AND "${field}" != '')`;
  }
}

export async function searchItems(
  albumTableName: string,
  criteria: SearchCriteria[],
  quickSearch?: string,
  useAndLogic = true
): Promise<AlbumItem[]> {
  const db = await getDatabase();

  const whereClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build criteria clauses
  for (const criterion of criteria) {
    if (criterion.operator === 'isEmpty' || criterion.operator === 'isNotEmpty') {
      whereClauses.push(operatorToSql(criterion.operator, criterion.field, paramIndex));
    } else {
      whereClauses.push(operatorToSql(criterion.operator, criterion.field, paramIndex));
      params.push(criterion.value);
      paramIndex++;
    }
  }

  // Quick search (searches all text fields)
  if (quickSearch) {
    // Get all text columns from typeinfo
    const typeinfo = await db.select<Array<Record<string, string>>>(
      `SELECT * FROM "${albumTableName}_typeinfo" LIMIT 1`
    );

    if (typeinfo.length > 0) {
      const textFields = Object.entries(typeinfo[0])
        .filter(([key, value]) => key !== 'id' && key !== 'schema_version' && value === 'TEXT')
        .map(([key]) => key);

      if (textFields.length > 0) {
        const quickClauses = textFields.map(
          field => `"${field}" LIKE '%' || $${paramIndex} || '%'`
        );
        whereClauses.push(`(${quickClauses.join(' OR ')})`);
        params.push(quickSearch);
      }
    }
  }

  const whereClause = whereClauses.length > 0
    ? ` WHERE ${whereClauses.join(useAndLogic ? ' AND ' : ' OR ')}`
    : '';

  const sql = `SELECT id FROM "${albumTableName}"${whereClause} ORDER BY id DESC`;
  const rows = await db.select<Array<{ id: number }>>(sql, params);

  // Fetch full items for matching IDs
  const items = await getAlbumItems(albumTableName);
  const matchingIds = new Set(rows.map(r => r.id));

  return items.filter(item => matchingIds.has(item.id));
}
```

### 6.4 Picture Service (TypeScript + Rust for thumbnails)

```typescript
// src/services/pictures.ts

import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { appDataDir, join } from '@tauri-apps/api/path';
import { getDatabase } from './database';
import type { Picture } from '../types/item';

export async function addPicture(
  albumTableName: string,
  itemId: number
): Promise<Picture | null> {
  // Open file picker
  const selected = await open({
    multiple: false,
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }],
  });

  if (!selected) return null;

  const sourcePath = selected as string;
  const dataDir = await appDataDir();

  // Copy original image (Rust command)
  const originalDir = await join(dataDir, albumTableName);
  const originalFilename = await invoke<string>('copy_and_rename_image', {
    sourcePath,
    destDir: originalDir,
  });

  // Generate thumbnail (Rust command)
  const thumbnailDir = await join(dataDir, 'thumbnails');
  const thumbnailFilename = await invoke<string>('generate_thumbnail', {
    sourcePath,
    destDir: thumbnailDir,
    size: 200,
  });

  // Save to database
  const db = await getDatabase();
  const result = await db.execute(
    `INSERT INTO "${albumTableName}_pictures"
     (original_picture_filename, thumbnail_picture_filename, album_item_foreign_key)
     VALUES ($1, $2, $3)`,
    [originalFilename, thumbnailFilename, itemId]
  );

  return {
    id: result.lastInsertId,
    originalFilename,
    thumbnailFilename,
  };
}

export async function deletePicture(
  albumTableName: string,
  pictureId: number
): Promise<void> {
  const db = await getDatabase();

  // Get filenames before deleting
  const rows = await db.select<Array<{
    original_picture_filename: string;
    thumbnail_picture_filename: string;
  }>>(
    `SELECT * FROM "${albumTableName}_pictures" WHERE id = $1`,
    [pictureId]
  );

  if (rows.length > 0) {
    // TODO: Delete files from filesystem via Tauri fs plugin
  }

  // Delete from database
  await db.execute(
    `DELETE FROM "${albumTableName}_pictures" WHERE id = $1`,
    [pictureId]
  );
}

export async function getPicturePath(
  albumTableName: string,
  filename: string
): Promise<string> {
  const dataDir = await appDataDir();
  return join(dataDir, albumTableName, filename);
}

export async function getThumbnailPath(filename: string): Promise<string> {
  const dataDir = await appDataDir();
  return join(dataDir, 'thumbnails', filename);
}
```

### 6.3 React Hooks with TanStack Query

```typescript
// src/hooks/useAlbums.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { albumApi } from '../services/api';
import type { FieldDefinition } from '../types/album';

export function useAlbums() {
  return useQuery({
    queryKey: ['albums'],
    queryFn: albumApi.getAll,
  });
}

export function useAlbumSchema(albumTableName: string) {
  return useQuery({
    queryKey: ['album-schema', albumTableName],
    queryFn: () => albumApi.getSchema(albumTableName),
    enabled: !!albumTableName,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      fields,
      hasPictures,
    }: {
      name: string;
      fields: FieldDefinition[];
      hasPictures: boolean;
    }) => albumApi.create(name, fields, hasPictures),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumTableName: string) => albumApi.delete(albumTableName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}
```

```typescript
// src/hooks/useItems.ts

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { itemApi } from '../services/api';
import type { FieldValue } from '../types/item';

const PAGE_SIZE = 50;

export function useItems(albumTableName: string) {
  return useQuery({
    queryKey: ['items', albumTableName],
    queryFn: () => itemApi.getAll(albumTableName),
    enabled: !!albumTableName,
  });
}

export function useInfiniteItems(albumTableName: string) {
  return useInfiniteQuery({
    queryKey: ['items', albumTableName, 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      itemApi.getAll(albumTableName, PAGE_SIZE, pageParam * PAGE_SIZE),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === PAGE_SIZE ? pages.length : undefined,
    enabled: !!albumTableName,
  });
}

export function useCreateItem(albumTableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: FieldValue[]) => itemApi.create(albumTableName, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', albumTableName] });
    },
  });
}

export function useUpdateItem(albumTableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, fields }: { itemId: number; fields: FieldValue[] }) =>
      itemApi.update(albumTableName, itemId, fields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', albumTableName] });
    },
  });
}

export function useDeleteItem(albumTableName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => itemApi.delete(albumTableName, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', albumTableName] });
    },
  });
}
```

### 6.4 Zustand Store for UI State

```typescript
// src/stores/uiStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Selected album
  selectedAlbumTableName: string | null;
  setSelectedAlbum: (tableName: string | null) => void;

  // View mode
  viewMode: 'grid' | 'table' | 'detail';
  setViewMode: (mode: 'grid' | 'table' | 'detail') => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Selected item
  selectedItemId: number | null;
  setSelectedItem: (id: number | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      selectedAlbumTableName: null,
      setSelectedAlbum: (tableName) => set({ selectedAlbumTableName: tableName, selectedItemId: null }),

      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),

      theme: 'system',
      setTheme: (theme) => set({ theme }),

      selectedItemId: null,
      setSelectedItem: (id) => set({ selectedItemId: id }),
    }),
    {
      name: 'sammelbox-ui',
    }
  )
);
```

### 6.5 Main Components

```tsx
// src/App.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AlbumPage } from './pages/AlbumPage';
import { SettingsPage } from './pages/SettingsPage';
import { ThemeProvider } from './components/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/album/:tableName" element={<AlbumPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

```tsx
// src/components/layout/Layout.tsx

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '../../stores/uiStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

```tsx
// src/components/layout/Sidebar.tsx

import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  CogIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAlbums } from '../../hooks/useAlbums';
import { useUIStore } from '../../stores/uiStore';

export function Sidebar() {
  const location = useLocation();
  const { data: albums, isLoading } = useAlbums();
  const { sidebarOpen, toggleSidebar, setSelectedAlbum } = useUIStore();

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {sidebarOpen && <h1 className="text-xl font-bold text-gray-800 dark:text-white">Sammelbox</h1>}
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          {sidebarOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-2">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            location.pathname === '/'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          {sidebarOpen && <span>Home</span>}
        </Link>

        <div className="mt-4">
          {sidebarOpen && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-semibold text-gray-500 uppercase">Albums</span>
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="px-3 py-2 text-gray-500">Loading...</div>
          ) : (
            <ul className="space-y-1">
              {albums?.map((album) => (
                <li key={album.id}>
                  <Link
                    to={`/album/${album.albumTableName}`}
                    onClick={() => setSelectedAlbum(album.albumTableName)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === `/album/${album.albumTableName}`
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FolderIcon className="w-5 h-5" />
                    {sidebarOpen && <span className="truncate">{album.albumName}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <CogIcon className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
```

```tsx
// src/components/items/ItemGrid.tsx

import { useInfiniteItems } from '../../hooks/useItems';
import { ItemCard } from './ItemCard';
import { useUIStore } from '../../stores/uiStore';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface ItemGridProps {
  albumTableName: string;
}

export function ItemGrid({ albumTableName }: ItemGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteItems(albumTableName);

  const { setSelectedItem } = useUIStore();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />
        ))}
      </div>
    );
  }

  const items = data?.pages.flatMap((page) => page) ?? [];

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No items in this album yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Click the + button to add your first item.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item.id)}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
        )}
      </div>
    </>
  );
}
```

```tsx
// src/components/items/ItemCard.tsx

import { convertFileSrc } from '@tauri-apps/api/core';
import type { AlbumItem } from '../../types/item';
import { StarRating } from '../ui/StarRating';

interface ItemCardProps {
  item: AlbumItem;
  onClick: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const thumbnail = item.pictures[0]?.thumbnailFilename;
  const titleField = item.fields.find(f => f.fieldType === 'TEXT');
  const ratingField = item.fields.find(f => f.fieldType === 'STAR_RATING');

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-700">
        {thumbnail ? (
          <img
            src={convertFileSrc(thumbnail)}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {titleField?.value as string || `Item #${item.id}`}
        </h3>

        {ratingField && (
          <StarRating value={ratingField.value as number} readonly size="sm" />
        )}

        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {item.fields
            .filter(f => f.fieldType !== 'TEXT' && f.fieldType !== 'STAR_RATING' && f.fieldType !== 'ID')
            .slice(0, 2)
            .map(f => (
              <div key={f.name} className="truncate">
                <span className="font-medium">{f.name}:</span> {String(f.value)}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
```

### 6.6 Dynamic Form Generation

```tsx
// src/components/items/ItemForm.tsx

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AlbumSchema } from '../../types/album';
import type { FieldValue } from '../../types/item';
import { Input } from '../ui/Input';
import { StarRating } from '../ui/StarRating';
import { DatePicker } from '../ui/DatePicker';
import { Select } from '../ui/Select';

interface ItemFormProps {
  schema: AlbumSchema;
  initialValues?: FieldValue[];
  onSubmit: (values: FieldValue[]) => void;
  onCancel: () => void;
}

export function ItemForm({ schema, initialValues, onSubmit, onCancel }: ItemFormProps) {
  // Build dynamic Zod schema based on field definitions
  const zodSchema = z.object(
    Object.fromEntries(
      schema.fields.map((field) => {
        let validator: z.ZodTypeAny;

        switch (field.fieldType) {
          case 'TEXT':
          case 'URL':
          case 'UUID':
            validator = z.string();
            break;
          case 'INTEGER':
          case 'STAR_RATING':
            validator = z.number().int();
            break;
          case 'DECIMAL':
            validator = z.number();
            break;
          case 'DATE':
          case 'TIME':
            validator = z.string();
            break;
          case 'OPTION':
            validator = z.enum(['YES', 'NO', 'UNKNOWN']);
            break;
          default:
            validator = z.unknown();
        }

        return [field.name, validator.optional()];
      })
    )
  );

  const defaultValues = Object.fromEntries(
    schema.fields.map((field) => {
      const existing = initialValues?.find((v) => v.name === field.name);
      return [field.name, existing?.value ?? getDefaultForType(field.fieldType)];
    })
  );

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  const onFormSubmit = (data: Record<string, unknown>) => {
    const fieldValues: FieldValue[] = schema.fields.map((field) => ({
      name: field.name,
      value: data[field.name],
      fieldType: field.fieldType,
    }));
    onSubmit(fieldValues);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {schema.fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {field.name}
          </label>

          <Controller
            name={field.name}
            control={control}
            render={({ field: formField }) => (
              <FieldInput
                fieldType={field.fieldType}
                value={formField.value}
                onChange={formField.onChange}
                error={errors[field.name]?.message as string}
              />
            )}
          />
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}

function FieldInput({
  fieldType,
  value,
  onChange,
  error
}: {
  fieldType: string;
  value: unknown;
  onChange: (v: unknown) => void;
  error?: string;
}) {
  switch (fieldType) {
    case 'TEXT':
    case 'URL':
    case 'UUID':
      return <Input value={value as string} onChange={(e) => onChange(e.target.value)} error={error} />;

    case 'INTEGER':
      return <Input type="number" value={value as number} onChange={(e) => onChange(parseInt(e.target.value))} error={error} />;

    case 'DECIMAL':
      return <Input type="number" step="0.01" value={value as number} onChange={(e) => onChange(parseFloat(e.target.value))} error={error} />;

    case 'STAR_RATING':
      return <StarRating value={value as number} onChange={onChange} />;

    case 'DATE':
      return <DatePicker value={value as string} onChange={onChange} />;

    case 'TIME':
      return <Input type="time" value={value as string} onChange={(e) => onChange(e.target.value)} error={error} />;

    case 'OPTION':
      return (
        <Select
          value={value as string}
          onChange={onChange}
          options={[
            { value: 'YES', label: 'Yes' },
            { value: 'NO', label: 'No' },
            { value: 'UNKNOWN', label: 'Unknown' },
          ]}
        />
      );

    default:
      return <Input value={String(value)} onChange={(e) => onChange(e.target.value)} error={error} />;
  }
}

function getDefaultForType(fieldType: string): unknown {
  switch (fieldType) {
    case 'INTEGER':
    case 'DECIMAL':
      return 0;
    case 'STAR_RATING':
      return 0;
    case 'OPTION':
      return 'UNKNOWN';
    default:
      return '';
  }
}
```

---

## 7. Feature Implementation Map

| Original Feature | Implementation | Priority |
|-----------------|----------------|----------|
| **Album Management** | | |
| Create album | `create_album` command + `AlbumForm` component | P0 |
| Delete album | `delete_album` command + confirmation modal | P0 |
| Rename album | `rename_album` command + inline edit | P1 |
| Alter album schema | `update_album_schema` + schema editor UI | P1 |
| **Item Management** | | |
| Add item | `create_item` command + `ItemForm` | P0 |
| Edit item | `update_item` command + `ItemForm` | P0 |
| Delete item | `delete_item` command + confirmation | P0 |
| View items (grid/table) | `ItemGrid`/`ItemTable` components | P0 |
| **Pictures** | | |
| Add pictures | `add_picture` command + file picker | P0 |
| View pictures | `ImageGallery` + `ImageViewer` | P0 |
| Delete pictures | `delete_picture` command | P0 |
| Thumbnails | Rust `image` crate for generation | P0 |
| **Search** | | |
| Quick search | `search_items` with `quickSearch` param | P0 |
| Advanced search | `AdvancedSearch` component with criteria builder | P1 |
| Saved searches | `save_search`/`get_saved_searches` commands | P1 |
| **Import/Export** | | |
| CSV import | `import_csv` command + file picker | P1 |
| CSV export | `export_csv` command + file save dialog | P1 |
| HTML export | `export_html` command + template selection | P2 |
| **Synchronization** | | |
| LAN discovery | mDNS/UDP broadcast via `mdns` crate | P2 |
| Sync protocol | Custom TCP protocol or gRPC | P2 |
| **Settings** | | |
| Language selection | i18n via `react-i18next` | P1 |
| Theme (dark/light) | Zustand + TailwindCSS dark mode | P0 |
| Backup/restore | File system operations via Tauri | P1 |

**Priority Legend:**
- **P0** = Must have (MVP)
- **P1** = Should have (v1.0)
- **P2** = Nice to have (v1.x)

---

## 8. Data Migration Strategy

### 8.1 Zero Migration Required

Because we're maintaining **100% database compatibility**, users can:

1. **Direct Database Use**: Point the new app to the existing `sammelbox.db` file
2. **Copy App Data**: Copy the entire `~/Sammelbox/app-data/` directory

### 8.2 File Structure Compatibility

```
~/Sammelbox/app-data/           # Original location
├── sammelbox.db                # SQLite database (compatible)
├── [album_name]/               # Album image directories
│   └── [uuid]_[timestamp].png  # Original images
└── thumbnails/                 # Thumbnail directory
    └── [uuid]_[timestamp].png  # Thumbnail images
```

The new application should:
1. Detect if an existing Sammelbox installation exists
2. Offer to use the existing data directory
3. Or create a new data directory

### 8.3 Settings Migration

Original settings location: `~/Sammelbox/app-data/settings/`

Create a one-time migration function to convert old settings to new format:

```rust
// src-tauri/src/migrations.rs

pub fn migrate_settings_if_needed(app_data_dir: &PathBuf) -> Result<(), String> {
    let old_settings = app_data_dir.join("settings");
    let new_settings = app_data_dir.join("config.json");

    if old_settings.exists() && !new_settings.exists() {
        // Read old XML/properties settings
        // Convert to JSON format
        // Write new config.json
    }

    Ok(())
}
```

---

## 9. Build & Deployment

### 9.1 Development Setup

```bash
# Prerequisites
# - Node.js 20.x
# - Rust 1.75+
# - pnpm

# Clone and setup
git clone <repository>
cd sammelbox-modern

# Install dependencies
pnpm install

# Development mode
pnpm tauri dev
```

### 9.2 Build Commands

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

### 9.3 Tauri Configuration

```json
// src-tauri/tauri.conf.json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Sammelbox",
  "version": "2.0.0",
  "identifier": "org.sammelbox.app",
  "build": {
    "beforeDevCommand": "pnpm dev",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "pnpm build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "Sammelbox",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": "default-src 'self'; img-src 'self' asset: https://asset.localhost"
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "windows": {
      "certificateThumbprint": null,
      "digestAlgorithm": "sha256",
      "timestampUrl": ""
    },
    "macOS": {
      "minimumSystemVersion": "10.15"
    },
    "linux": {
      "appimage": {
        "bundleMediaFramework": true
      }
    }
  }
}
```

### 9.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    strategy:
      fail-fast: false
      matrix:
        platform: [macos-latest, ubuntu-latest, windows-latest]

    runs-on: ${{ matrix.platform }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Install dependencies (Ubuntu)
        if: matrix.platform == 'ubuntu-latest'
        run: |
          sudo apt-get update
          sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf

      - name: Install frontend dependencies
        run: pnpm install

      - name: Build
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: v__VERSION__
          releaseName: 'Sammelbox v__VERSION__'
          releaseBody: 'See the assets to download this version.'
          releaseDraft: true
          prerelease: false
```

---

## 10. Development Roadmap

### Phase 1: Foundation (Weeks 1-3)

- [ ] Project scaffolding (Tauri + React + TypeScript)
- [ ] Database connection and schema compatibility
- [ ] Basic album CRUD operations
- [ ] Basic item CRUD operations
- [ ] Core UI layout (sidebar, header, main content)

### Phase 2: Core Features (Weeks 4-6)

- [ ] Dynamic form generation based on album schema
- [ ] Image handling (upload, thumbnail generation, display)
- [ ] Grid and table view modes
- [ ] Quick search functionality
- [ ] Dark/light theme support

### Phase 3: Advanced Features (Weeks 7-9)

- [ ] Advanced search with criteria builder
- [ ] Saved searches
- [ ] CSV import/export
- [ ] HTML export with templates
- [ ] Settings page

### Phase 4: Polish & Testing (Weeks 10-12)

- [ ] LAN synchronization
- [ ] Internationalization (EN, DE, FR)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Beta release

### Phase 5: Release (Week 13+)

- [ ] Bug fixes from beta feedback
- [ ] Final testing across all platforms
- [ ] Release builds for Windows, macOS, Linux
- [ ] Migration guide for existing users

---

## 11. Testing Strategy

### 11.1 Reusing Existing Java Tests

The original Sammelbox has **57 integration tests** that define the exact behavior the new implementation must match. We can leverage these:

#### Test Assets (Direct Reuse)

| Asset | Location | Use |
|-------|----------|-----|
| Test backup | `test/testdata/test-albums-version-3.4.3.cbk` | Load to verify DB compatibility |
| CSV files | `test/testdata/import-test-data/*.csv` | Test import functionality |
| Test images | `test/testdata/import-test-data/*.png` | Test picture handling |

#### Ported Test Structure

```
tests/
├── integration/
│   ├── albums.test.ts         # From CreateAlbumTests, AlterAlbumTests
│   ├── items.test.ts          # From AddAlbumItemTests, UpdateAlbumItemTests
│   ├── search.test.ts         # From QuickSearchTests, AdvancedSearchTests
│   ├── backup-restore.test.ts # From BackupRestoreTests
│   ├── import-export.test.ts  # From CSVImportTests, ExportTests
│   └── saved-searches.test.ts # From SavedSearchesTests
├── unit/
│   ├── services/
│   └── utils/
└── e2e/
    └── playwright/
```

### 11.2 Example Ported Tests

```typescript
// tests/integration/albums.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { createAlbum, getAllAlbums, deleteAlbum, getAlbumSchema } from '../../src/services/albums';
import { resetTestDatabase, loadTestBackup } from '../helpers/database';

describe('Album Creation (from CreateAlbumTests.java)', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  it('testBookCreation - creates album with standard fields', async () => {
    const album = await createAlbum('Books', [
      { name: 'Book Title', fieldType: 'TEXT', quickSearchable: true },
      { name: 'Author', fieldType: 'TEXT', quickSearchable: true },
      { name: 'Purchased', fieldType: 'DATE', quickSearchable: false },
      { name: 'Price', fieldType: 'DECIMAL', quickSearchable: false },
      { name: 'Lent to', fieldType: 'TEXT', quickSearchable: false },
    ], false);

    expect(album.id).toBeGreaterThan(0);
    expect(album.albumName).toBe('Books');

    const schema = await getAlbumSchema(album.albumTableName);
    expect(schema.fields).toHaveLength(5);
    expect(schema.fields[0].name).toBe('Book Title');
  });

  it('testAlbumWithScoreCreation - hyphens convert to underscores', async () => {
    const album = await createAlbum('My-Books', [
      { name: 'Book-Title', fieldType: 'TEXT', quickSearchable: false },
    ], false);

    expect(album.albumTableName).toBe('my_books');
  });

  it('testAlbumCreationWithEmptyFieldList - empty fields allowed', async () => {
    const album = await createAlbum('Empty Album', [], false);
    expect(album.id).toBeGreaterThan(0);

    const schema = await getAlbumSchema(album.albumTableName);
    expect(schema.fields).toHaveLength(0);
  });
});

describe('Search Tests (from QuickSearchTests.java)', () => {
  beforeEach(async () => {
    await loadTestBackup('test-albums-version-3.4.3.cbk');
  });

  it('testQuickSearchActorInDVDs - finds Smith in 2 movies', async () => {
    const results = await searchItems('DVDs', [], 'Smith');

    // Original test expects 2 results: Independence Day, Wild Wild West
    expect(results.length).toBe(2);
  });

  it('testQuickSearchActorsInDVDs - multiple terms', async () => {
    const results = await searchItems('DVDs', [], 'Cooper');
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('Database Compatibility', () => {
  it('loads original Java-created backup file', async () => {
    await loadTestBackup('test-albums-version-3.4.3.cbk');

    const albums = await getAllAlbums();

    // Test backup contains 3 albums
    expect(albums.length).toBe(3);

    // Verify expected album data
    const books = albums.find(a => a.albumName === 'Books');
    const dvds = albums.find(a => a.albumName === 'DVDs');
    const music = albums.find(a => a.albumName === 'Music CDs');

    expect(books).toBeDefined();
    expect(dvds).toBeDefined();
    expect(music).toBeDefined();
  });

  it('Books album has 10 items', async () => {
    await loadTestBackup('test-albums-version-3.4.3.cbk');
    const items = await getAlbumItems('Books');
    expect(items.length).toBe(10);
  });

  it('DVDs album has 11 items', async () => {
    await loadTestBackup('test-albums-version-3.4.3.cbk');
    const items = await getAlbumItems('DVDs');
    expect(items.length).toBe(11);
  });
});
```

### 11.3 Test Coverage Goals

| Category | Test Count | Source |
|----------|-----------|--------|
| Album CRUD | 19 | CreateAlbumTests, AlterAlbumTests, RemoveAlbumTests |
| Item CRUD | 12 | AddAlbumItemTests, UpdateAlbumItemTests, RemoveAlbumItemTests |
| Pictures | 3 | AlbumItemPictureTests |
| Search | 11 | QuickSearchTests, AdvancedSearchTests |
| Saved Searches | 6 | SavedSearchesTests, ModifySavedSearchesTests |
| Backup/Restore | 7 | BackupRestoreTests |
| Import/Export | 7 | CSVImportTests, ExportTests |
| **Total** | **65** | |

### 11.4 Running Tests

```bash
# Unit tests (fast, no Tauri)
pnpm test

# Integration tests (requires Tauri)
pnpm test:integration

# E2E tests (full app)
pnpm test:e2e

# All tests
pnpm test:all
```

---

## 12. Appendix

### A. Cargo Dependencies (Minimal)

```toml
# src-tauri/Cargo.toml
[package]
name = "sammelbox"
version = "2.0.0"
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.0", features = [] }

[dependencies]
tauri = { version = "2.0", features = ["protocol-asset"] }
tauri-plugin-sql = { version = "2.0", features = ["sqlite"] }
tauri-plugin-fs = "2.0"
tauri-plugin-dialog = "2.0"
tauri-plugin-shell = "2.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
image = "0.25"
uuid = { version = "1.7", features = ["v4"] }

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
```

**Note:** No `rusqlite` - SQLite is handled by `tauri-plugin-sql` from TypeScript.

### B. Node Dependencies

```json
// package.json
{
  "name": "sammelbox-modern",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri"
  },
  "dependencies": {
    "@heroicons/react": "^2.1.1",
    "@hookform/resolvers": "^3.3.4",
    "@tanstack/react-query": "^5.17.19",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-dialog": "^2.0.0",
    "@tauri-apps/plugin-fs": "^2.0.0",
    "@tauri-apps/plugin-shell": "^2.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "react-intersection-observer": "^9.5.3",
    "react-router-dom": "^6.21.3",
    "zod": "^3.22.4",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.19.1",
    "@typescript-eslint/parser": "^6.19.1",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.12",
    "vitest": "^1.2.2"
  }
}
```

### C. Resources

- [Tauri Documentation](https://tauri.app/v2/guides/)
- [React Documentation](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [TailwindCSS](https://tailwindcss.com/docs)
- [rusqlite](https://docs.rs/rusqlite/latest/rusqlite/)

---

*Document created: January 2026*
*Last updated: January 2026*
