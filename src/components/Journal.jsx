import { useState } from 'react';
import { saveUserData } from '../utils/storage';

export default function Journal({ userData, updateUserData }) {
  const [newEntry, setNewEntry] = useState('');

  const handleAddEntry = () => {
    if (!newEntry.trim()) return;
    
    updateUserData(prev => {
      const updated = { ...prev };
      updated.journal = updated.journal || [];
      updated.journal.unshift({
        timestamp: new Date().toISOString(),
        text: newEntry,
      });
      saveUserData(updated);
      return updated;
    });
    
    setNewEntry('');
  };

  const handleDeleteEntry = (index) => {
    updateUserData(prev => {
      const updated = { ...prev };
      updated.journal = (updated.journal || []).filter((_, i) => i !== index);
      saveUserData(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon-blue">Journal</h2>

      <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
        <h3 className="text-lg font-semibold text-neon-blue mb-4">New Entry</h3>
        <textarea
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full px-4 py-3 bg-gray-800 border border-neon-blue/30 rounded-lg text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-neon-blue"
          rows="5"
        />
        <button
          onClick={handleAddEntry}
          className="mt-3 px-6 py-2 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors font-semibold"
        >
          Add Entry
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neon-blue">Journal Entries</h3>
        {userData.journal && userData.journal.length > 0 ? (
          userData.journal.map((entry, index) => {
            const date = new Date(entry.timestamp);
            return (
              <div
                key={index}
                className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    {date.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteEntry(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-white whitespace-pre-wrap">{entry.text}</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-8">No journal entries yet</p>
        )}
      </div>
    </div>
  );
}

