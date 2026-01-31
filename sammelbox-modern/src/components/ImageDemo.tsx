import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { appDataDir, join } from '@tauri-apps/api/path';

interface ImageDimensions {
  width: number;
  height: number;
}

export function ImageDemo() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('No image selected');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectImage = async () => {
    try {
      setError(null);
      setStatus('Opening file dialog...');

      const selected = await open({
        multiple: false,
        filters: [
          {
            name: 'Images',
            extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'],
          },
        ],
      });

      if (selected && typeof selected === 'string') {
        setSelectedFile(selected);
        setStatus(`Selected: ${selected}`);
        setDimensions(null);
        setThumbnailPath(null);
      } else {
        setStatus('No file selected');
      }
    } catch (err) {
      setError(`Failed to open dialog: ${err}`);
    }
  };

  const handleGetDimensions = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);
      setStatus('Getting image dimensions via Rust...');

      const dims = await invoke<ImageDimensions>('get_image_dimensions', {
        path: selectedFile,
      });

      setDimensions(dims);
      setStatus(`Image size: ${dims.width} x ${dims.height} pixels`);
    } catch (err) {
      setError(`Failed to get dimensions: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);
      setStatus('Generating thumbnail via Rust image processing...');

      const dataDir = await appDataDir();
      const thumbnailDir = await join(dataDir, 'thumbnails');

      const filename = await invoke<string>('generate_thumbnail', {
        sourcePath: selectedFile,
        destDir: thumbnailDir,
        size: 200,
      });

      const fullPath = await join(thumbnailDir, filename);
      setThumbnailPath(fullPath);
      setStatus(`Thumbnail generated: ${filename}`);
    } catch (err) {
      setError(`Failed to generate thumbnail: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Image Processing Demo (Rust)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This demonstrates Rust being used for CPU-intensive image operations.
          The thumbnail generation uses the Rust `image` crate for native performance.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              loading
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}
          >
            {loading ? 'Processing...' : 'Ready'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{status}</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* File Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Select an Image</h3>
        <div className="space-y-3">
          <button
            onClick={handleSelectImage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose Image File
          </button>

          {selectedFile && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                {selectedFile}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Operations */}
      {selectedFile && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Image Operations</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGetDimensions}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Get Dimensions
            </button>
            <button
              onClick={handleGenerateThumbnail}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate Thumbnail (200px)
            </button>
          </div>

          {/* Results */}
          <div className="mt-4 space-y-3">
            {dimensions && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Dimensions (from Rust):
                </p>
                <p className="text-lg font-mono text-green-900 dark:text-green-100">
                  {dimensions.width} x {dimensions.height} pixels
                </p>
              </div>
            )}

            {thumbnailPath && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Thumbnail generated (via Rust):
                </p>
                <p className="text-sm font-mono text-purple-900 dark:text-purple-100 break-all">
                  {thumbnailPath}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tech Info */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">How it works</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>File dialog uses `@tauri-apps/plugin-dialog` (TypeScript)</li>
          <li>Image dimensions use Rust `image` crate via Tauri command</li>
          <li>Thumbnail generation uses Rust for native-speed image processing</li>
          <li>Files are saved using Rust's `std::fs` for reliable I/O</li>
        </ul>
      </div>
    </div>
  );
}
