import { useState, useEffect } from 'react';
import { getAllItems, addItem, deleteItem, DemoItem } from '../services/database';

export function DatabaseDemo() {
  const [items, setItems] = useState<DemoItem[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initializing...');

  const loadItems = async () => {
    try {
      setStatus('Loading items from SQLite...');
      const data = await getAllItems();
      setItems(data);
      setStatus(`Loaded ${data.length} items from SQLite database`);
      setError(null);
    } catch (err) {
      setError(`Failed to load items: ${err}`);
      setStatus('Error loading database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setStatus('Adding item to SQLite...');
      await addItem(name, description);
      setName('');
      setDescription('');
      await loadItems();
    } catch (err) {
      setError(`Failed to add item: ${err}`);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setStatus('Deleting item from SQLite...');
      await deleteItem(id);
      await loadItems();
    } catch (err) {
      setError(`Failed to delete item: ${err}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          SQLite Database Demo
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This demonstrates the Tauri SQL plugin working with SQLite.
          All data is stored locally in a SQLite database file.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {loading ? 'Loading...' : 'Connected'}
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

      {/* Add Item Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Add New Item</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Items List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Items in Database ({items.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No items yet. Add one above!
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    ID: {item.id} | Created: {item.created_at}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800
                           dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
