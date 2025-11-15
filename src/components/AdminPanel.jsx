import { useState } from 'react';
import { awardXP, applyPenalty, applyPornRelapse } from '../utils/gameLogic';
import { saveUserData } from '../utils/storage';
import { processDayEnd, processWeekEnd } from '../utils/dayProcessor';

export default function AdminPanel({ userData, updateUserData, addNotification, onClose }) {
  const [xpAmount, setXpAmount] = useState(100);
  const [penaltyAmount, setPenaltyAmount] = useState(50);

  const handleAwardXP = () => {
    updateUserData(prev => {
      const result = awardXP(prev, parseInt(xpAmount) || 100, {});
      const updated = { ...prev, ...result };
      saveUserData(updated);
      
      addNotification({
        timestamp: new Date().toISOString(),
        type: 'ALERT',
        message: `Admin: Awarded ${xpAmount} XP`,
        deltaXP: result.xpGained,
      });
      
      return updated;
    });
  };

  const handleApplyPenalty = () => {
    updateUserData(prev => {
      const updated = applyPenalty(prev, -Math.abs(parseInt(penaltyAmount) || 50), {});
      saveUserData(updated);
      
      addNotification({
        timestamp: new Date().toISOString(),
        type: 'PENALTY',
        message: `Admin: Applied penalty of ${penaltyAmount} XP`,
        deltaXP: -Math.abs(parseInt(penaltyAmount) || 50),
      });
      
      return updated;
    });
  };

  const handleSimulateRelapse = () => {
    if (confirm('Simulate porn relapse? This will apply all relapse penalties.')) {
      updateUserData(prev => {
        const updated = applyPornRelapse(prev);
        saveUserData(updated);
        
        addNotification({
          timestamp: new Date().toISOString(),
          type: 'DANGER',
          message: 'Admin: Simulated porn relapse',
        });
        
        return updated;
      });
    }
  };

  const handleSimulateDayEnd = () => {
    if (confirm('Simulate day end? This will process missed quests and apply penalties.')) {
      updateUserData(prev => {
        const result = processDayEnd(prev);
        result.notifications.forEach(n => addNotification(n));
        saveUserData(result.userData);
        return result.userData;
      });
    }
  };

  const handleSimulateWeekEnd = () => {
    if (confirm('Simulate week end? This will process missed weekly quests and apply penalties.')) {
      updateUserData(prev => {
        const result = processWeekEnd(prev);
        result.notifications.forEach(n => addNotification(n));
        saveUserData(result.userData);
        return result.userData;
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-neon-blue/50 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-neon-blue">Admin / Debug Panel</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded text-sm text-yellow-400">
            ⚠️ This panel is for testing and debugging only.
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Award XP</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
                />
                <button
                  onClick={handleAwardXP}
                  className="px-4 py-2 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark transition-colors font-semibold"
                >
                  Award
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Apply Penalty</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
                />
                <button
                  onClick={handleApplyPenalty}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-semibold"
                >
                  Penalize
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700 space-y-2">
              <button
                onClick={handleSimulateRelapse}
                className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
              >
                Simulate Porn Relapse
              </button>
              <button
                onClick={handleSimulateDayEnd}
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
              >
                Simulate Day End
              </button>
              <button
                onClick={handleSimulateWeekEnd}
                className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
              >
                Simulate Week End
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

