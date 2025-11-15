import { useState } from 'react';
import { saveUserData, exportUserData, importUserData } from '../utils/storage';

export default function Settings({ userData, updateUserData }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importData, setImportData] = useState('');

  const handleExport = () => {
    const json = exportUserData(userData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solo-leveling-${userData.username}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      const imported = importUserData(importData);
      updateUserData(imported);
      setImportData('');
      alert('Data imported successfully!');
    } catch (e) {
      alert('Import failed: ' + e.message);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = importUserData(event.target.result);
        updateUserData(imported);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your profile? This cannot be undone!')) {
      localStorage.removeItem(`soloLeveling::${userData.username}`);
      window.location.reload();
    }
  };

  const toggleSetting = (key) => {
    updateUserData(prev => {
      const updated = { ...prev };
      updated.settings[key] = !updated.settings[key];
      saveUserData(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon-blue">Settings</h2>

      <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6 space-y-6">
        {/* Auto Penalties */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Automatic Penalties</h3>
            <p className="text-sm text-gray-400">Apply penalties automatically for missed quests</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userData.settings.autoPenalties}
              onChange={() => toggleSetting('autoPenalties')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
          </label>
        </div>

        {!userData.settings.autoPenalties && (
          <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded text-sm text-orange-400">
            ⚠️ Automatic penalties are disabled. You will need to apply penalties manually.
          </div>
        )}

        {/* Glow Effect */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Glow Effects</h3>
            <p className="text-sm text-gray-400">Enable/disable visual glow effects</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userData.settings.glow}
              onChange={() => toggleSetting('glow')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-blue/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-blue"></div>
          </label>
        </div>

        {/* Export/Import */}
        <div className="pt-6 border-t border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold text-white">Data Management</h3>
          
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors font-semibold"
            >
              Export Data
            </button>

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
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm text-center cursor-pointer"
                >
                  Import File
                </label>
                <button
                  onClick={handleImport}
                  className="flex-1 px-4 py-2 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors text-sm font-semibold"
                >
                  Import JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Reset Profile
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-400 mb-4">Reset Profile</h3>
            <p className="text-gray-300 mb-4">
              This will permanently delete all your progress. This action cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

