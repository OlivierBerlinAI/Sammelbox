use image::GenericImageView;
use serde::Serialize;
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Serialize)]
pub struct ImageDimensions {
    pub width: u32,
    pub height: u32,
}

/// Generate a thumbnail from an image file
/// This demonstrates Rust being used for CPU-intensive image processing
#[tauri::command]
pub async fn generate_thumbnail(
    source_path: String,
    dest_dir: String,
    size: u32,
) -> Result<String, String> {
    let source = PathBuf::from(&source_path);
    let dest = PathBuf::from(&dest_dir);

    // Generate unique filename (matching original Sammelbox format: uuid_timestamp.ext)
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
    std::fs::create_dir_all(&dest).map_err(|e| format!("Failed to create directory: {}", e))?;

    // Open and process image
    let img = image::open(&source).map_err(|e| format!("Failed to open image: {}", e))?;

    // Generate thumbnail maintaining aspect ratio
    let thumbnail = img.thumbnail(size, size);

    let thumbnail_path = dest.join(&thumbnail_filename);
    thumbnail
        .save(&thumbnail_path)
        .map_err(|e| format!("Failed to save thumbnail: {}", e))?;

    Ok(thumbnail_filename)
}

/// Get image dimensions - demonstrates simple Rust image processing
#[tauri::command]
pub async fn get_image_dimensions(path: String) -> Result<ImageDimensions, String> {
    let img = image::open(&path).map_err(|e| format!("Failed to open image: {}", e))?;
    let (width, height) = img.dimensions();
    Ok(ImageDimensions { width, height })
}
