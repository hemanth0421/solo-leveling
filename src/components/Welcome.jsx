import { useState } from 'react';
import { loadUserData, createDefaultUserData, saveUserData, exportUserData, importUserData } from '../utils/storage';

export default function Welcome({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    let userData = loadUserData(username);
    if (!userData) {
      userData = createDefaultUserData(username);
      saveUserData(userData);
    }

    onLogin(username, userData);
  };

  const handleExport = () => {
    const currentUser = localStorage.getItem('soloLeveling::currentUser');
    if (!currentUser) {
      setError('No user data to export');
      return;
    }
    const data = loadUserData(currentUser);
    if (!data) {
      setError('No user data found');
      return;
    }

    const json = exportUserData(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solo-leveling-${data.username}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const userData = importUserData(importData);
      saveUserData(userData);
      setImportData('');
      setShowImport(false);
      setError('');
      alert('Data imported successfully! Please log in with the imported username.');
    } catch (e) {
      setError('Import failed: ' + e.message);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const userData = importUserData(event.target.result);
        saveUserData(userData);
        setError('');
        alert('Data imported successfully! Please log in with the imported username.');
      } catch (err) {
        setError('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm rounded-lg border border-neon-blue/30 p-8 shadow-glow">
        <h1 className="text-4xl font-bold text-center mb-2 text-neon-blue">
          SoloLeveling
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Life Progression System
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-neon-blue/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent"
              placeholder="Enter your username"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-neon-blue text-navy-dark font-semibold rounded-lg hover:bg-neon-blue-dark transition-colors shadow-glow"
          >
            Enter
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
          <p className="text-xs text-gray-500 text-center">
            All data is stored locally in your browser. Clearing browser data will erase your progress.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="flex-1 py-2 px-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              {showImport ? 'Cancel Import' : 'Import Data'}
            </button>
            <button
              onClick={handleExport}
              className="flex-1 py-2 px-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Export Data
            </button>
          </div>

          {showImport && (
            <div className="space-y-2">
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON data here..."
                className="w-full px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue"
                rows="4"
              />
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="file-import"
                />
                <label
                  htmlFor="file-import"
                  className="flex-1 py-2 px-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm text-center cursor-pointer"
                >
                  Import File
                </label>
                <button
                  onClick={handleImport}
                  className="flex-1 py-2 px-4 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors text-sm font-semibold"
                >
                  Import JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

