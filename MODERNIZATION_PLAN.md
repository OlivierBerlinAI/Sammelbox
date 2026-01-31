# Sammelbox Modernization Plan
## Tauri + React + TypeScript Implementation

**Document Version:** 1.0
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
11. [Appendix](#11-appendix)

---

## 1. Executive Summary

### Goals

- **Complete rewrite** of Sammelbox in a modern tech stack
- **100% database compatibility** with existing SQLite databases
- **Cross-platform support** for Windows, macOS, and Linux
- **Modern UI/UX** with responsive design and dark mode
- **Maintainable codebase** with type safety throughout

### Why Tauri + React + TypeScript?

| Benefit | Description |
|---------|-------------|
| **Small Bundle** | ~10MB vs 150MB+ for Electron |
| **Native Performance** | Rust backend for CPU-intensive operations |
| **Type Safety** | TypeScript frontend + Rust backend = fewer runtime errors |
| **Modern UI** | React ecosystem with rich component libraries |
| **Security** | Tauri's security-first architecture |
| **Future Mobile** | Tauri 2.0 supports iOS and Android |

---

## 2. Technology Stack

### Core Technologies

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│  React 18+          UI Framework                            │
│  TypeScript 5+      Type-safe JavaScript                    │
│  Vite 5+            Build tool & dev server                 │
│  TailwindCSS 3+     Utility-first CSS                       │
│  React Router 6+    Client-side routing                     │
│  TanStack Query     Server state management                 │
│  Zustand            Client state management                 │
│  React Hook Form    Form handling                           │
│  Zod                Schema validation                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Tauri IPC (Commands & Events)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│  Tauri 2.0          Application framework                   │
│  Rust 1.75+         Systems programming language            │
│  rusqlite           SQLite bindings                         │
│  serde              Serialization/deserialization           │
│  tokio              Async runtime                           │
│  image              Image processing                        │
│  uuid               UUID generation                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
├─────────────────────────────────────────────────────────────┤
│  SQLite 3.x         Embedded database (existing format)     │
└─────────────────────────────────────────────────────────────┘
```

### Version Requirements

| Technology | Minimum Version | Recommended |
|------------|-----------------|-------------|
| Node.js | 18.x | 20.x LTS |
| Rust | 1.70 | 1.75+ |
| Tauri | 2.0 | 2.x latest |
| React | 18.0 | 18.2+ |
| TypeScript | 5.0 | 5.3+ |

### Development Tools

- **IDE:** VS Code with Rust Analyzer + TypeScript extensions
- **Package Manager:** pnpm (faster, disk-efficient)
- **Linting:** ESLint + Prettier (frontend), Clippy (Rust)
- **Testing:** Vitest (frontend), Rust test framework (backend)
- **E2E Testing:** Playwright or WebdriverIO

---

## 3. Project Structure

```
sammelbox-modern/
├── src-tauri/                    # Rust backend
│   ├── Cargo.toml                # Rust dependencies
│   ├── tauri.conf.json           # Tauri configuration
│   ├── capabilities/             # Permission capabilities
│   ├── icons/                    # App icons
│   └── src/
│       ├── main.rs               # Entry point
│       ├── lib.rs                # Library root
│       ├── commands/             # Tauri commands (IPC handlers)
│       │   ├── mod.rs
│       │   ├── albums.rs         # Album CRUD operations
│       │   ├── items.rs          # Album item operations
│       │   ├── pictures.rs       # Image handling
│       │   ├── search.rs         # Search & filter
│       │   ├── import_export.rs  # CSV/HTML import/export
│       │   └── sync.rs           # LAN synchronization
│       ├── database/             # Database layer
│       │   ├── mod.rs
│       │   ├── connection.rs     # Connection management
│       │   ├── schema.rs         # Schema definitions
│       │   ├── migrations.rs     # Schema migrations
│       │   └── queries/          # SQL query builders
│       │       ├── mod.rs
│       │       ├── albums.rs
│       │       ├── items.rs
│       │       └── pictures.rs
│       ├── models/               # Data models
│       │   ├── mod.rs
│       │   ├── album.rs
│       │   ├── field.rs
│       │   ├── item.rs
│       │   └── picture.rs
│       ├── services/             # Business logic
│       │   ├── mod.rs
│       │   ├── image_service.rs  # Thumbnail generation
│       │   ├── export_service.rs # Export functionality
│       │   ├── import_service.rs # Import functionality
│       │   └── sync_service.rs   # Network sync
│       └── utils/                # Utilities
│           ├── mod.rs
│           ├── paths.rs          # Path resolution
│           └── errors.rs         # Error handling
│
├── src/                          # React frontend
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
│   │   ├── api.ts                # Tauri command wrappers
│   │   ├── albums.ts
│   │   ├── items.ts
│   │   └── search.ts
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

| Original FieldType | SQLite Type | Rust Type | TypeScript Type |
|-------------------|-------------|-----------|-----------------|
| ID | INTEGER | i64 | number |
| TEXT | TEXT | String | string |
| DECIMAL | REAL | f64 | number |
| DATE | TEXT | String | string (ISO 8601) |
| TIME | TEXT | String | string |
| UUID | TEXT | String | string |
| STAR_RATING | INTEGER | i32 (0-5) | number |
| URL | TEXT | String | string |
| INTEGER | INTEGER | i64 | number |
| OPTION | TEXT | String | 'YES' \| 'NO' \| 'UNKNOWN' |

### 4.3 Rust Database Models

```rust
// src-tauri/src/models/album.rs

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AlbumMaster {
    pub id: i64,
    pub album_name: String,
    pub album_table_name: String,
    pub has_pictures: OptionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum OptionType {
    Yes,
    No,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AlbumSchema {
    pub fields: Vec<FieldDefinition>,
    pub schema_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldDefinition {
    pub name: String,
    pub field_type: FieldType,
    pub quick_searchable: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum FieldType {
    Id,
    Text,
    Decimal,
    Date,
    Time,
    Uuid,
    StarRating,
    Url,
    Integer,
    Option,
}
```

```rust
// src-tauri/src/models/item.rs

use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AlbumItem {
    pub id: i64,
    pub fields: Vec<FieldValue>,
    pub content_version: String,
    pub pictures: Vec<Picture>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldValue {
    pub name: String,
    pub value: Value,  // Dynamic JSON value
    pub field_type: FieldType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Picture {
    pub id: i64,
    pub original_filename: String,
    pub thumbnail_filename: String,
}
```

### 4.4 Database Connection Management

```rust
// src-tauri/src/database/connection.rs

use rusqlite::{Connection, OpenFlags};
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::State;

pub struct DatabaseState(pub Mutex<Connection>);

pub fn initialize_database(app_data_dir: &PathBuf) -> Result<Connection, rusqlite::Error> {
    let db_path = app_data_dir.join("sammelbox.db");

    let conn = Connection::open_with_flags(
        &db_path,
        OpenFlags::SQLITE_OPEN_READ_WRITE
            | OpenFlags::SQLITE_OPEN_CREATE
            | OpenFlags::SQLITE_OPEN_FULL_MUTEX,
    )?;

    // Enable foreign keys (matching original behavior)
    conn.execute_batch("PRAGMA foreign_keys = ON;")?;

    // Create master table if not exists
    conn.execute(
        "CREATE TABLE IF NOT EXISTS album_master_table (
            id INTEGER PRIMARY KEY,
            album_name TEXT,
            album_table_name TEXT,
            has_pictures TEXT
        )",
        [],
    )?;

    Ok(conn)
}
```

---

## 5. Backend Architecture (Rust/Tauri)

### 5.1 Tauri Commands (IPC Interface)

Commands are the bridge between frontend and backend. They're invoked from TypeScript and executed in Rust.

```rust
// src-tauri/src/commands/albums.rs

use crate::database::DatabaseState;
use crate::models::{AlbumMaster, AlbumSchema, FieldDefinition};
use tauri::State;

#[tauri::command]
pub async fn get_all_albums(
    db: State<'_, DatabaseState>,
) -> Result<Vec<AlbumMaster>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, album_name, album_table_name, has_pictures FROM album_master_table")
        .map_err(|e| e.to_string())?;

    let albums = stmt
        .query_map([], |row| {
            Ok(AlbumMaster {
                id: row.get(0)?,
                album_name: row.get(1)?,
                album_table_name: row.get(2)?,
                has_pictures: row.get::<_, String>(3)?.parse().unwrap_or_default(),
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(albums)
}

#[tauri::command]
pub async fn create_album(
    db: State<'_, DatabaseState>,
    name: String,
    fields: Vec<FieldDefinition>,
    has_pictures: bool,
) -> Result<AlbumMaster, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    // Generate table name (sanitized)
    let table_name = sanitize_table_name(&name);
    let schema_version = uuid::Uuid::new_v4().to_string();

    // Start transaction
    conn.execute("BEGIN TRANSACTION", []).map_err(|e| e.to_string())?;

    // 1. Create main album table
    let columns_sql = fields
        .iter()
        .map(|f| format!("\"{}\" {}", f.name, f.field_type.to_sql_type()))
        .collect::<Vec<_>>()
        .join(", ");

    let create_table_sql = format!(
        r#"CREATE TABLE "{}" (
            id INTEGER PRIMARY KEY,
            {},
            content_version TEXT,
            typeinfo INTEGER,
            FOREIGN KEY(typeinfo) REFERENCES "{}_typeinfo"(id)
        )"#,
        table_name, columns_sql, table_name
    );

    conn.execute(&create_table_sql, []).map_err(|e| e.to_string())?;

    // 2. Create typeinfo table
    let typeinfo_columns = fields
        .iter()
        .map(|f| format!("\"{}\" TEXT", f.name))
        .collect::<Vec<_>>()
        .join(", ");

    let create_typeinfo_sql = format!(
        r#"CREATE TABLE "{}_typeinfo" (
            id INTEGER PRIMARY KEY,
            {},
            schema_version TEXT
        )"#,
        table_name, typeinfo_columns
    );

    conn.execute(&create_typeinfo_sql, []).map_err(|e| e.to_string())?;

    // 3. Insert typeinfo row
    let typeinfo_values = fields
        .iter()
        .map(|f| format!("'{}'", f.field_type.to_string()))
        .collect::<Vec<_>>()
        .join(", ");

    let insert_typeinfo_sql = format!(
        r#"INSERT INTO "{}_typeinfo" ({}, schema_version) VALUES ({}, '{}')"#,
        table_name,
        fields.iter().map(|f| format!("\"{}\"", f.name)).collect::<Vec<_>>().join(", "),
        typeinfo_values,
        schema_version
    );

    conn.execute(&insert_typeinfo_sql, []).map_err(|e| e.to_string())?;

    // 4. Create pictures table if needed
    if has_pictures {
        let create_pictures_sql = format!(
            r#"CREATE TABLE "{}_pictures" (
                id INTEGER PRIMARY KEY,
                original_picture_filename TEXT,
                thumbnail_picture_filename TEXT,
                album_item_foreign_key INTEGER
            )"#,
            table_name
        );
        conn.execute(&create_pictures_sql, []).map_err(|e| e.to_string())?;
    }

    // 5. Register in master table
    let has_pictures_str = if has_pictures { "YES" } else { "NO" };
    conn.execute(
        "INSERT INTO album_master_table (album_name, album_table_name, has_pictures) VALUES (?1, ?2, ?3)",
        [&name, &table_name, has_pictures_str],
    ).map_err(|e| e.to_string())?;

    let album_id = conn.last_insert_rowid();

    conn.execute("COMMIT", []).map_err(|e| e.to_string())?;

    Ok(AlbumMaster {
        id: album_id,
        album_name: name,
        album_table_name: table_name,
        has_pictures: if has_pictures { OptionType::Yes } else { OptionType::No },
    })
}

#[tauri::command]
pub async fn delete_album(
    db: State<'_, DatabaseState>,
    album_table_name: String,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    conn.execute("BEGIN TRANSACTION", []).map_err(|e| e.to_string())?;

    // Drop all related tables
    conn.execute(&format!(r#"DROP TABLE IF EXISTS "{}""#, album_table_name), [])
        .map_err(|e| e.to_string())?;
    conn.execute(&format!(r#"DROP TABLE IF EXISTS "{}_typeinfo""#, album_table_name), [])
        .map_err(|e| e.to_string())?;
    conn.execute(&format!(r#"DROP TABLE IF EXISTS "{}_pictures""#, album_table_name), [])
        .map_err(|e| e.to_string())?;

    // Remove from master table
    conn.execute(
        "DELETE FROM album_master_table WHERE album_table_name = ?1",
        [&album_table_name],
    ).map_err(|e| e.to_string())?;

    conn.execute("COMMIT", []).map_err(|e| e.to_string())?;

    Ok(())
}
```

### 5.2 Item Operations

```rust
// src-tauri/src/commands/items.rs

use crate::database::DatabaseState;
use crate::models::{AlbumItem, FieldValue};
use serde_json::Value;
use tauri::State;

#[tauri::command]
pub async fn get_album_items(
    db: State<'_, DatabaseState>,
    album_table_name: String,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Vec<AlbumItem>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    // First get the schema to know column types
    let schema = get_album_schema_internal(&conn, &album_table_name)?;

    let limit_clause = limit.map(|l| format!(" LIMIT {}", l)).unwrap_or_default();
    let offset_clause = offset.map(|o| format!(" OFFSET {}", o)).unwrap_or_default();

    let sql = format!(
        r#"SELECT * FROM "{}" ORDER BY id DESC{}{}"#,
        album_table_name, limit_clause, offset_clause
    );

    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let column_count = stmt.column_count();
    let column_names: Vec<String> = stmt.column_names().iter().map(|s| s.to_string()).collect();

    let items = stmt
        .query_map([], |row| {
            let id: i64 = row.get("id")?;
            let content_version: String = row.get("content_version").unwrap_or_default();

            let mut fields = Vec::new();
            for (i, col_name) in column_names.iter().enumerate() {
                // Skip internal columns
                if col_name == "id" || col_name == "content_version" || col_name == "typeinfo" {
                    continue;
                }

                if let Some(field_def) = schema.fields.iter().find(|f| &f.name == col_name) {
                    let value = extract_value(row, i, &field_def.field_type);
                    fields.push(FieldValue {
                        name: col_name.clone(),
                        value,
                        field_type: field_def.field_type.clone(),
                    });
                }
            }

            Ok(AlbumItem {
                id,
                fields,
                content_version,
                pictures: Vec::new(), // Loaded separately
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(items)
}

#[tauri::command]
pub async fn create_item(
    db: State<'_, DatabaseState>,
    album_table_name: String,
    fields: Vec<FieldValue>,
) -> Result<AlbumItem, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let content_version = uuid::Uuid::new_v4().to_string();

    let column_names: Vec<String> = fields.iter().map(|f| format!("\"{}\"", f.name)).collect();
    let placeholders: Vec<String> = (1..=fields.len()).map(|i| format!("?{}", i)).collect();

    let sql = format!(
        r#"INSERT INTO "{}" ({}, content_version, typeinfo) VALUES ({}, ?{}, 1)"#,
        album_table_name,
        column_names.join(", "),
        placeholders.join(", "),
        fields.len() + 1
    );

    // Build params dynamically
    let params: Vec<Box<dyn rusqlite::ToSql>> = fields
        .iter()
        .map(|f| value_to_sql(&f.value, &f.field_type))
        .collect();

    conn.execute(&sql, rusqlite::params_from_iter(params.iter()))
        .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    Ok(AlbumItem {
        id,
        fields,
        content_version,
        pictures: Vec::new(),
    })
}

#[tauri::command]
pub async fn update_item(
    db: State<'_, DatabaseState>,
    album_table_name: String,
    item_id: i64,
    fields: Vec<FieldValue>,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let content_version = uuid::Uuid::new_v4().to_string();

    let set_clauses: Vec<String> = fields
        .iter()
        .enumerate()
        .map(|(i, f)| format!("\"{}\" = ?{}", f.name, i + 1))
        .collect();

    let sql = format!(
        r#"UPDATE "{}" SET {}, content_version = ?{} WHERE id = ?{}"#,
        album_table_name,
        set_clauses.join(", "),
        fields.len() + 1,
        fields.len() + 2
    );

    // Execute update...

    Ok(())
}

#[tauri::command]
pub async fn delete_item(
    db: State<'_, DatabaseState>,
    album_table_name: String,
    item_id: i64,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    // Delete associated pictures first
    conn.execute(
        &format!(r#"DELETE FROM "{}_pictures" WHERE album_item_foreign_key = ?1"#, album_table_name),
        [item_id],
    ).map_err(|e| e.to_string())?;

    // Delete item
    conn.execute(
        &format!(r#"DELETE FROM "{}" WHERE id = ?1"#, album_table_name),
        [item_id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}
```

### 5.3 Image Service

```rust
// src-tauri/src/services/image_service.rs

use image::{GenericImageView, ImageFormat};
use std::path::PathBuf;
use uuid::Uuid;

pub struct ImageService {
    app_data_dir: PathBuf,
    thumbnail_size: u32,
}

impl ImageService {
    pub fn new(app_data_dir: PathBuf) -> Self {
        Self {
            app_data_dir,
            thumbnail_size: 200,
        }
    }

    pub fn add_picture(
        &self,
        album_name: &str,
        source_path: &PathBuf,
    ) -> Result<(String, String), String> {
        // Generate unique filenames (matching original format)
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis();
        let uuid = Uuid::new_v4();

        let extension = source_path
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("png");

        let original_filename = format!("{}_{}.{}", uuid, timestamp, extension);
        let thumbnail_filename = format!("{}_{}_thumb.{}", uuid, timestamp, extension);

        // Create directories
        let album_dir = self.app_data_dir.join(album_name);
        let thumbnail_dir = self.app_data_dir.join("thumbnails");
        std::fs::create_dir_all(&album_dir).map_err(|e| e.to_string())?;
        std::fs::create_dir_all(&thumbnail_dir).map_err(|e| e.to_string())?;

        // Copy original
        let original_path = album_dir.join(&original_filename);
        std::fs::copy(source_path, &original_path).map_err(|e| e.to_string())?;

        // Generate thumbnail
        let img = image::open(source_path).map_err(|e| e.to_string())?;
        let thumbnail = img.thumbnail(self.thumbnail_size, self.thumbnail_size);
        let thumbnail_path = thumbnail_dir.join(&thumbnail_filename);
        thumbnail.save(&thumbnail_path).map_err(|e| e.to_string())?;

        Ok((original_filename, thumbnail_filename))
    }

    pub fn delete_picture(
        &self,
        album_name: &str,
        original_filename: &str,
        thumbnail_filename: &str,
    ) -> Result<(), String> {
        let original_path = self.app_data_dir.join(album_name).join(original_filename);
        let thumbnail_path = self.app_data_dir.join("thumbnails").join(thumbnail_filename);

        let _ = std::fs::remove_file(original_path);
        let _ = std::fs::remove_file(thumbnail_path);

        Ok(())
    }

    pub fn get_picture_path(&self, album_name: &str, filename: &str) -> PathBuf {
        self.app_data_dir.join(album_name).join(filename)
    }

    pub fn get_thumbnail_path(&self, filename: &str) -> PathBuf {
        self.app_data_dir.join("thumbnails").join(filename)
    }
}
```

### 5.4 Search Implementation

```rust
// src-tauri/src/commands/search.rs

use crate::database::DatabaseState;
use crate::models::AlbumItem;
use tauri::State;

#[derive(Debug, Clone, serde::Deserialize)]
pub struct SearchCriteria {
    pub field: String,
    pub operator: SearchOperator,
    pub value: String,
}

#[derive(Debug, Clone, serde::Deserialize)]
pub enum SearchOperator {
    Equals,
    NotEquals,
    Contains,
    StartsWith,
    EndsWith,
    GreaterThan,
    LessThan,
    GreaterOrEqual,
    LessOrEqual,
    IsEmpty,
    IsNotEmpty,
}

impl SearchOperator {
    fn to_sql(&self, field: &str, placeholder: &str) -> String {
        match self {
            SearchOperator::Equals => format!("\"{}\" = {}", field, placeholder),
            SearchOperator::NotEquals => format!("\"{}\" != {}", field, placeholder),
            SearchOperator::Contains => format!("\"{}\" LIKE '%' || {} || '%'", field, placeholder),
            SearchOperator::StartsWith => format!("\"{}\" LIKE {} || '%'", field, placeholder),
            SearchOperator::EndsWith => format!("\"{}\" LIKE '%' || {}", field, placeholder),
            SearchOperator::GreaterThan => format!("\"{}\" > {}", field, placeholder),
            SearchOperator::LessThan => format!("\"{}\" < {}", field, placeholder),
            SearchOperator::GreaterOrEqual => format!("\"{}\" >= {}", field, placeholder),
            SearchOperator::LessOrEqual => format!("\"{}\" <= {}", field, placeholder),
            SearchOperator::IsEmpty => format!("(\"{}\" IS NULL OR \"{}\" = '')", field, field),
            SearchOperator::IsNotEmpty => format!("(\"{}\" IS NOT NULL AND \"{}\" != '')", field, field),
        }
    }
}

#[tauri::command]
pub async fn search_items(
    db: State<'_, DatabaseState>,
    album_table_name: String,
    criteria: Vec<SearchCriteria>,
    quick_search: Option<String>,
) -> Result<Vec<AlbumItem>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut where_clauses = Vec::new();
    let mut params: Vec<String> = Vec::new();

    // Advanced search criteria
    for (i, criterion) in criteria.iter().enumerate() {
        let placeholder = format!("?{}", i + 1);
        where_clauses.push(criterion.operator.to_sql(&criterion.field, &placeholder));
        params.push(criterion.value.clone());
    }

    // Quick search (searches all quick-searchable fields)
    if let Some(query) = quick_search {
        // Get quick-searchable fields from typeinfo
        let searchable_fields = get_quick_searchable_fields(&conn, &album_table_name)?;

        if !searchable_fields.is_empty() {
            let quick_clauses: Vec<String> = searchable_fields
                .iter()
                .map(|f| format!("\"{}\" LIKE '%' || ?{} || '%'", f, params.len() + 1))
                .collect();

            where_clauses.push(format!("({})", quick_clauses.join(" OR ")));
            params.push(query);
        }
    }

    let where_sql = if where_clauses.is_empty() {
        String::new()
    } else {
        format!(" WHERE {}", where_clauses.join(" AND "))
    };

    let sql = format!(
        r#"SELECT * FROM "{}"{} ORDER BY id DESC"#,
        album_table_name, where_sql
    );

    // Execute query and return results...
    todo!("Execute and map results")
}

#[tauri::command]
pub async fn save_search(
    db: State<'_, DatabaseState>,
    name: String,
    album_table_name: String,
    criteria: Vec<SearchCriteria>,
) -> Result<i64, String> {
    // Save search configuration to a saved_searches table
    todo!("Implement saved searches")
}
```

### 5.5 Main Entry Point

```rust
// src-tauri/src/main.rs

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod database;
mod models;
mod services;
mod utils;

use database::{connection::DatabaseState, initialize_database};
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // Get app data directory
            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Failed to get app data directory");

            std::fs::create_dir_all(&app_data_dir)
                .expect("Failed to create app data directory");

            // Initialize database
            let conn = initialize_database(&app_data_dir)
                .expect("Failed to initialize database");

            app.manage(DatabaseState(Mutex::new(conn)));

            // Initialize image service
            let image_service = services::ImageService::new(app_data_dir.clone());
            app.manage(image_service);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Album commands
            commands::albums::get_all_albums,
            commands::albums::create_album,
            commands::albums::delete_album,
            commands::albums::get_album_schema,
            commands::albums::update_album_schema,
            // Item commands
            commands::items::get_album_items,
            commands::items::create_item,
            commands::items::update_item,
            commands::items::delete_item,
            // Picture commands
            commands::pictures::add_picture,
            commands::pictures::delete_picture,
            commands::pictures::get_picture_path,
            // Search commands
            commands::search::search_items,
            commands::search::save_search,
            commands::search::get_saved_searches,
            commands::search::run_saved_search,
            // Import/Export commands
            commands::import_export::import_csv,
            commands::import_export::export_csv,
            commands::import_export::export_html,
            // Sync commands
            commands::sync::start_sync_server,
            commands::sync::discover_peers,
            commands::sync::sync_with_peer,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## 6. Frontend Architecture (React)

### 6.1 TypeScript Types

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

import { FieldType } from './album';

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

### 6.2 Tauri API Service

```typescript
// src/services/api.ts

import { invoke } from '@tauri-apps/api/core';
import type { Album, AlbumSchema, FieldDefinition } from '../types/album';
import type { AlbumItem, FieldValue } from '../types/item';
import type { SearchCriteria } from '../types/search';

// Album operations
export const albumApi = {
  getAll: () => invoke<Album[]>('get_all_albums'),

  create: (name: string, fields: FieldDefinition[], hasPictures: boolean) =>
    invoke<Album>('create_album', { name, fields, hasPictures }),

  delete: (albumTableName: string) =>
    invoke<void>('delete_album', { albumTableName }),

  getSchema: (albumTableName: string) =>
    invoke<AlbumSchema>('get_album_schema', { albumTableName }),

  updateSchema: (albumTableName: string, fields: FieldDefinition[]) =>
    invoke<void>('update_album_schema', { albumTableName, fields }),
};

// Item operations
export const itemApi = {
  getAll: (albumTableName: string, limit?: number, offset?: number) =>
    invoke<AlbumItem[]>('get_album_items', { albumTableName, limit, offset }),

  create: (albumTableName: string, fields: FieldValue[]) =>
    invoke<AlbumItem>('create_item', { albumTableName, fields }),

  update: (albumTableName: string, itemId: number, fields: FieldValue[]) =>
    invoke<void>('update_item', { albumTableName, itemId, fields }),

  delete: (albumTableName: string, itemId: number) =>
    invoke<void>('delete_item', { albumTableName, itemId }),
};

// Search operations
export const searchApi = {
  search: (albumTableName: string, criteria: SearchCriteria[], quickSearch?: string) =>
    invoke<AlbumItem[]>('search_items', { albumTableName, criteria, quickSearch }),

  saveSearch: (name: string, albumTableName: string, criteria: SearchCriteria[]) =>
    invoke<number>('save_search', { name, albumTableName, criteria }),

  getSavedSearches: (albumTableName: string) =>
    invoke<SavedSearch[]>('get_saved_searches', { albumTableName }),
};

// Picture operations
export const pictureApi = {
  add: (albumTableName: string, itemId: number, filePath: string) =>
    invoke<Picture>('add_picture', { albumTableName, itemId, filePath }),

  delete: (albumTableName: string, pictureId: number) =>
    invoke<void>('delete_picture', { albumTableName, pictureId }),

  getPath: (albumName: string, filename: string) =>
    invoke<string>('get_picture_path', { albumName, filename }),
};

// Import/Export operations
export const importExportApi = {
  importCsv: (albumTableName: string, filePath: string) =>
    invoke<number>('import_csv', { albumTableName, filePath }),

  exportCsv: (albumTableName: string, filePath: string) =>
    invoke<void>('export_csv', { albumTableName, filePath }),

  exportHtml: (albumTableName: string, filePath: string, template?: string) =>
    invoke<void>('export_html', { albumTableName, filePath, template }),
};
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

## 11. Appendix

### A. Cargo Dependencies

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
tauri-plugin-shell = "2.0"
tauri-plugin-dialog = "2.0"
tauri-plugin-fs = "2.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
rusqlite = { version = "0.31", features = ["bundled"] }
uuid = { version = "1.7", features = ["v4"] }
image = "0.25"
tokio = { version = "1.36", features = ["full"] }
thiserror = "1.0"
log = "0.4"
env_logger = "0.11"

[features]
default = ["custom-protocol"]
custom-protocol = ["tauri/custom-protocol"]
```

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
