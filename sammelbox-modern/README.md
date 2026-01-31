# Sammelbox Modern - Tech Stack Demo

This is a minimal working demo to verify the technology stack before implementing the full Sammelbox rewrite.

## Tech Stack

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Tauri 2.0 (minimal Rust)
- **Database**: SQLite via `@tauri-apps/plugin-sql`
- **Image Processing**: Rust `image` crate

## Prerequisites

Before running this demo, ensure you have:

### 1. Node.js (v18 or later)

```bash
node --version  # Should be v18.x or higher
```

### 2. Rust (v1.70 or later)

```bash
# Install Rust if you don't have it
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Verify installation
rustc --version  # Should be 1.70.0 or higher
```

### 3. Platform-specific dependencies

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### macOS

```bash
# Xcode Command Line Tools
xcode-select --install
```

#### Windows

- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 11)

## Setup & Run

### 1. Install dependencies

```bash
cd sammelbox-modern
npm install
```

### 2. Run in development mode

```bash
npm run tauri:dev
```

This will:
1. Start the Vite dev server for the React frontend
2. Compile the Rust backend
3. Launch the Tauri application window

**First run will take longer** as Rust needs to compile dependencies.

## What to Test

### SQLite Database Tab

1. Add items using the form
2. Verify items appear in the list
3. Delete items
4. Refresh the app - items should persist

This proves: `@tauri-apps/plugin-sql` is working correctly

### Image Processing Tab

1. Click "Choose Image File" to select an image
2. Click "Get Dimensions" to test Rust image reading
3. Click "Generate Thumbnail" to test Rust image processing

This proves: Rust commands are working and can process images

### Dark Mode

Click the sun/moon icon in the header to toggle dark mode.

This proves: TailwindCSS dark mode is working

## Project Structure

```
sammelbox-modern/
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── DatabaseDemo.tsx
│   │   └── ImageDemo.tsx
│   ├── services/           # TypeScript services
│   │   └── database.ts     # SQLite operations
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── commands/
│   │   │   └── images.rs   # Image processing (ONLY Rust code)
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── package.json
└── README.md
```

## Troubleshooting

### "command not found: tauri"

Make sure you installed dependencies:
```bash
npm install
```

### Rust compilation errors

Update Rust:
```bash
rustup update
```

### Linux: WebKit not found

Install the required libraries:
```bash
sudo apt install libwebkit2gtk-4.1-dev
```

### Windows: Build tools missing

Install Visual Studio Build Tools and restart your terminal.

## Next Steps

Once you verify this demo works:

1. All technologies are correctly installed
2. Tauri 2.0 builds and runs
3. SQLite database operations work
4. Rust image processing works
5. React + TailwindCSS UI works

You're ready to proceed with the full Sammelbox implementation!

## Build for Production

```bash
npm run tauri:build
```

This creates platform-specific installers in `src-tauri/target/release/bundle/`.
