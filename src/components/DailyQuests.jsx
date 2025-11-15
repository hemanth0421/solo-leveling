import { useState } from 'react';
import { awardXP, getStatBoostForTask, applyPornRelapse } from '../utils/gameLogic';
import { saveUserData } from '../utils/storage';
import { CONFIG } from '../config';
import { processDayEnd } from '../utils/dayProcessor';
import PornRelapseModal from './PornRelapseModal';

export default function DailyQuests({ userData, updateUserData, addNotification }) {
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestXP, setNewQuestXP] = useState(20);
  const [newQuestPenalty, setNewQuestPenalty] = useState(0);
  const [showRelapseModal, setShowRelapseModal] = useState(false);

  const handleQuestComplete = (questId, isFixed = true) => {
    updateUserData(prev => {
      const updated = { ...prev };
      
      if (isFixed) {
        const quest = updated.fixedDailyQuests.find(q => q.id === questId);
        if (quest && !quest.completedToday) {
          quest.completedToday = true;
          
          // Award XP
          const statBoosts = getStatBoostForTask(questId);
          const result = awardXP(updated, quest.baseXP, statBoosts);
          
          Object.assign(updated, result);
          
          // Update streaks
          if (questId === 'noporn') {
            updated.streaks.noPornDays = (updated.streaks.noPornDays || 0) + 1;
          }
          
          // Add log
          updated.logs = updated.logs || [];
          updated.logs.unshift({
            timestamp: new Date().toISOString(),
            type: 'QUEST_COMPLETE',
            message: `Completed: ${quest.title}`,
            deltaXP: result.xpGained,
          });
          
          addNotification({
            timestamp: new Date().toISOString(),
            type: 'ALERT',
            message: `Completed: ${quest.title}`,
            deltaXP: result.xpGained,
          });
          
          if (result.leveledUp) {
            addNotification({
              timestamp: new Date().toISOString(),
              type: 'LEVEL_UP',
              message: `Level Up! Now Level ${result.level}`,
            });
          }
          
          if (result.rankedUp) {
            addNotification({
              timestamp: new Date().toISOString(),
              type: 'RANK_UP',
              message: `Rank Up! Now Rank ${result.rank}`,
            });
          }
        }
      } else {
        const quest = updated.userDailyQuests.find(q => q.id === questId);
        if (quest && !quest.completed) {
          quest.completed = true;
          
          const result = awardXP(updated, quest.xpReward || 20, {});
          Object.assign(updated, result);
          
          updated.logs = updated.logs || [];
          updated.logs.unshift({
            timestamp: new Date().toISOString(),
            type: 'QUEST_COMPLETE',
            message: `Completed: ${quest.title}`,
            deltaXP: result.xpGained,
          });
          
          addNotification({
            timestamp: new Date().toISOString(),
            type: 'ALERT',
            message: `Completed: ${quest.title}`,
            deltaXP: result.xpGained,
          });
        }
      }
      
      saveUserData(updated);
      return updated;
    });
  };

  const handlePornRelapse = () => {
    setShowRelapseModal(true);
  };

  const confirmRelapse = (journalEntry) => {
    updateUserData(prev => {
      const updated = { ...prev };
      
      // Apply porn relapse penalty
      const result = applyPornRelapse(updated);
      Object.assign(updated, result);
      
      // Add journal entry if provided
      if (journalEntry) {
        updated.journal = updated.journal || [];
        updated.journal.unshift({
          timestamp: new Date().toISOString(),
          text: `[RELAPSE] ${journalEntry}`,
        });
      }
      
      // Add log
      updated.logs = updated.logs || [];
      updated.logs.unshift({
        timestamp: new Date().toISOString(),
        type: 'RELAPSE',
        message: 'Porn relapse detected. Severe penalties applied.',
        deltaXP: CONFIG.penalties.pornRelapse.xp,
      });
      
      addNotification({
        timestamp: new Date().toISOString(),
        type: 'DANGER',
        message: 'Porn relapse! Rank progression frozen for 48 hours.',
        deltaXP: CONFIG.penalties.pornRelapse.xp,
      });
      
      saveUserData(updated);
      return updated;
    });
    
    setShowRelapseModal(false);
  };

  const handleAddQuest = () => {
    if (!newQuestTitle.trim()) return;
    
    updateUserData(prev => {
      const updated = { ...prev };
      updated.userDailyQuests = updated.userDailyQuests || [];
      updated.userDailyQuests.push({
        id: `user-${Date.now()}`,
        title: newQuestTitle,
        xpReward: parseInt(newQuestXP) || 20,
        penaltyIfMissed: parseInt(newQuestPenalty) || 0,
        completed: false,
      });
      saveUserData(updated);
      return updated;
    });
    
    setNewQuestTitle('');
    setNewQuestXP(20);
    setNewQuestPenalty(0);
    setShowAddQuest(false);
  };

  const handleDeleteQuest = (questId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      updated.userDailyQuests = (updated.userDailyQuests || []).filter(q => q.id !== questId);
      saveUserData(updated);
      return updated;
    });
  };

  const handleEndDay = () => {
    updateUserData(prev => {
      const result = processDayEnd(prev);
      result.notifications.forEach(n => addNotification(n));
      saveUserData(result.userData);
      return result.userData;
    });
  };

  const noPornQuest = userData.fixedDailyQuests.find(q => q.id === 'noporn');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-blue">Daily Quests</h2>
        <button
          onClick={handleEndDay}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          End Day
        </button>
      </div>

      {/* Fixed Daily Quests */}
      <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
        <h3 className="text-lg font-semibold text-neon-blue mb-4">Fixed Daily Quests</h3>
        <div className="space-y-3">
          {userData.fixedDailyQuests.map(quest => (
            <div
              key={quest.id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-neon-blue/10"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={quest.completedToday || false}
                  onChange={() => {
                    if (quest.id === 'noporn' && !quest.completedToday) {
                      // Special handling for no-porn quest
                      handleQuestComplete(quest.id, true);
                    } else if (quest.id !== 'noporn') {
                      handleQuestComplete(quest.id, true);
                    }
                  }}
                  className="w-5 h-5 text-neon-blue rounded focus:ring-neon-blue"
                />
                <span className={`flex-1 ${quest.completedToday ? 'line-through text-gray-500' : 'text-white'}`}>
                  {quest.title}
                </span>
                <span className="text-sm text-neon-blue">+{quest.baseXP} XP</span>
              </div>
              {quest.id === 'noporn' && !quest.completedToday && (
                <button
                  onClick={handlePornRelapse}
                  className="ml-2 px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  Relapsed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Daily Quests */}
      <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neon-blue">Custom Daily Quests</h3>
          <button
            onClick={() => setShowAddQuest(!showAddQuest)}
            className="px-4 py-2 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors text-sm font-semibold"
          >
            {showAddQuest ? 'Cancel' : '+ Add Quest'}
          </button>
        </div>

        {showAddQuest && (
          <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-neon-blue/10">
            <input
              type="text"
              value={newQuestTitle}
              onChange={(e) => setNewQuestTitle(e.target.value)}
              placeholder="Quest title"
              className="w-full mb-2 px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newQuestXP}
                onChange={(e) => setNewQuestXP(e.target.value)}
                placeholder="XP Reward"
                className="px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
              />
              <input
                type="number"
                value={newQuestPenalty}
                onChange={(e) => setNewQuestPenalty(e.target.value)}
                placeholder="Penalty if missed"
                className="px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
              />
            </div>
            <button
              onClick={handleAddQuest}
              className="mt-2 w-full px-4 py-2 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark transition-colors"
            >
              Add Quest
            </button>
          </div>
        )}

        <div className="space-y-3">
          {userData.userDailyQuests && userData.userDailyQuests.length > 0 ? (
            userData.userDailyQuests.map(quest => (
              <div
                key={quest.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-neon-blue/10"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={quest.completed || false}
                    onChange={() => handleQuestComplete(quest.id, false)}
                    className="w-5 h-5 text-neon-blue rounded focus:ring-neon-blue"
                  />
                  <span className={`flex-1 ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {quest.title}
                  </span>
                  <span className="text-sm text-neon-blue">+{quest.xpReward} XP</span>
                  {quest.penaltyIfMissed > 0 && (
                    <span className="text-xs text-red-400">-{quest.penaltyIfMissed} if missed</span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteQuest(quest.id)}
                  className="ml-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No custom quests yet</p>
          )}
        </div>
      </div>

      {showRelapseModal && (
        <PornRelapseModal
          onConfirm={confirmRelapse}
          onCancel={() => setShowRelapseModal(false)}
        />
      )}
    </div>
  );
}

