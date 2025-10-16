import { useState, useEffect } from 'react';
import { hybridStorage, getStorageInfo, switchStorageMode, createBackup, exportData, importData, getStorageStats } from '../lib/storage-hybrid';

export default function StorageManager() {
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [backups, setBackups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDataText, setImportDataText] = useState('');

  useEffect(() => {
    loadStorageInfo();
    loadStorageStats();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const loadStorageStats = async () => {
    try {
      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const handleSwitchMode = async (mode: 'local' | 'cloud' | 'hybrid') => {
    setIsLoading(true);
    try {
      await switchStorageMode(mode);
      await loadStorageInfo();
      alert(`Switched to ${mode} storage mode`);
    } catch (error) {
      console.error('Failed to switch storage mode:', error);
      alert('Failed to switch storage mode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      const backupId = await createBackup();
      alert(`Backup created: ${backupId}`);
      await loadStorageStats();
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chabs-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = async () => {
    if (!importDataText.trim()) {
      alert('Please paste the import data');
      return;
    }

    setIsLoading(true);
    try {
      const success = await importData(importDataText);
      if (success) {
        alert('Data imported successfully');
        setShowImportModal(false);
        setImportDataText('');
        await loadStorageStats();
      } else {
        alert('Failed to import data');
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Failed to import data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Storage Mode Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          💾 Storage Configuration
        </h3>
        
        {storageInfo && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Mode</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {storageInfo.mode}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Network Status</div>
                <div className={`text-lg font-bold ${storageInfo.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {storageInfo.isOnline ? '🟢 Online' : '🔴 Offline'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Primary Provider</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {storageInfo.primaryProvider}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSwitchMode('local')}
                disabled={isLoading || storageInfo.mode === 'local'}
                className={`btn ${storageInfo.mode === 'local' ? 'btn-primary' : 'btn-secondary'}`}
              >
                🏠 Local Storage
              </button>
              <button
                onClick={() => handleSwitchMode('cloud')}
                disabled={isLoading || storageInfo.mode === 'cloud'}
                className={`btn ${storageInfo.mode === 'cloud' ? 'btn-primary' : 'btn-secondary'}`}
              >
                ☁️ Cloud Storage
              </button>
              <button
                onClick={() => handleSwitchMode('hybrid')}
                disabled={isLoading || storageInfo.mode === 'hybrid'}
                className={`btn ${storageInfo.mode === 'hybrid' ? 'btn-primary' : 'btn-secondary'}`}
              >
                🔄 Hybrid Mode
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Storage Statistics */}
      {storageStats && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Storage Statistics
          </h3>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{storageStats.totalRecords}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(storageStats.storageSize / 1024).toFixed(1)}KB
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Storage Size</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{storageStats.version}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Version</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(storageStats.entities).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Entity Types</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(storageStats.entities).map(([entity, count]) => (
              <div key={entity} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium capitalize">{entity}</span>
                <span className="text-lg font-bold text-blue-600">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Management */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🔧 Data Management
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={handleCreateBackup}
            disabled={isLoading}
            className="btn btn-primary p-4 text-left"
          >
            <div className="text-lg mb-2">💾</div>
            <div className="font-medium">Create Backup</div>
            <div className="text-sm opacity-80">Save current data state</div>
          </button>

          <button
            onClick={handleExportData}
            disabled={isLoading}
            className="btn btn-secondary p-4 text-left"
          >
            <div className="text-lg mb-2">📤</div>
            <div className="font-medium">Export Data</div>
            <div className="text-sm opacity-80">Download as JSON file</div>
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            disabled={isLoading}
            className="btn btn-secondary p-4 text-left"
          >
            <div className="text-lg mb-2">📥</div>
            <div className="font-medium">Import Data</div>
            <div className="text-sm opacity-80">Upload JSON data</div>
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  📥 Import Data
                </h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste JSON Data
                  </label>
                  <textarea
                    value={importDataText}
                    onChange={(e) => setImportDataText(e.target.value)}
                    className="input w-full h-64 font-mono text-sm"
                    placeholder="Paste your exported JSON data here..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImportData}
                    disabled={isLoading || !importDataText.trim()}
                    className="btn btn-primary"
                  >
                    {isLoading ? 'Importing...' : 'Import Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-transparent border-t-blue-600"></div>
              <span className="text-gray-900 dark:text-white">Processing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}