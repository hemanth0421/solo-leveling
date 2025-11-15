import { useState } from 'react';

export default function PornRelapseModal({ onConfirm, onCancel }) {
  const [journalEntry, setJournalEntry] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-red-500/50 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-red-400 mb-4">Porn Relapse Confirmation</h3>
        <p className="text-gray-300 mb-4 text-sm">
          This will apply severe penalties:
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>-100 XP</li>
            <li>Willpower reset to 0</li>
            <li>Rank progression frozen for 48 hours</li>
            <li>Endurance -5</li>
            <li>No-porn streak reset to 0</li>
          </ul>
        </p>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">
            Optional: Journal entry (why did this happen?)
          </label>
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Reflect on what led to this..."
            className="w-full px-3 py-2 bg-gray-800 border border-red-500/30 rounded text-white text-sm"
            rows="3"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(journalEntry)}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
          >
            Confirm Relapse
          </button>
        </div>
      </div>
    </div>
  );
}

