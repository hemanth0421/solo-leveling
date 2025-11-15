import { useState } from 'react';
import { awardXP } from '../utils/gameLogic';
import { saveUserData } from '../utils/storage';
import { processWeekEnd } from '../utils/dayProcessor';

export default function WeeklyQuests({ userData, updateUserData, addNotification }) {
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestXP, setNewQuestXP] = useState(100);

  const handleQuestComplete = (questId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      const quest = updated.weeklyQuests.find(q => q.id === questId);
      
      if (quest && !quest.completed) {
        quest.completed = true;
        
        const result = awardXP(updated, quest.baseXP || quest.xpReward || 100, {});
        Object.assign(updated, result);
        
        updated.logs = updated.logs || [];
        updated.logs.unshift({
          timestamp: new Date().toISOString(),
          type: 'QUEST_COMPLETE',
          message: `Completed weekly: ${quest.title}`,
          deltaXP: result.xpGained,
        });
        
        addNotification({
          timestamp: new Date().toISOString(),
          type: 'ALERT',
          message: `Completed weekly: ${quest.title}`,
          deltaXP: result.xpGained,
        });
      }
      
      saveUserData(updated);
      return updated;
    });
  };

  const handleAddQuest = () => {
    if (!newQuestTitle.trim()) return;
    
    updateUserData(prev => {
      const updated = { ...prev };
      updated.weeklyQuests = updated.weeklyQuests || [];
      updated.weeklyQuests.push({
        id: `weekly-${Date.now()}`,
        title: newQuestTitle,
        baseXP: parseInt(newQuestXP) || 100,
        completed: false,
        weekStart: prev.weeklyQuests?.[0]?.weekStart || new Date().toISOString(),
      });
      saveUserData(updated);
      return updated;
    });
    
    setNewQuestTitle('');
    setNewQuestXP(100);
    setShowAddQuest(false);
  };

  const handleDeleteQuest = (questId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      updated.weeklyQuests = (updated.weeklyQuests || []).filter(q => q.id !== questId);
      saveUserData(updated);
      return updated;
    });
  };

  const handleCompleteWeek = () => {
    updateUserData(prev => {
      const result = processWeekEnd(prev);
      result.notifications.forEach(n => addNotification(n));
      saveUserData(result.userData);
      return result.userData;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-blue">Weekly Quests</h2>
        <button
          onClick={handleCompleteWeek}
          className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Complete Week
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neon-blue">Weekly Quests</h3>
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
            <input
              type="number"
              value={newQuestXP}
              onChange={(e) => setNewQuestXP(e.target.value)}
              placeholder="XP Reward"
              className="w-full px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
            />
            <button
              onClick={handleAddQuest}
              className="mt-2 w-full px-4 py-2 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark transition-colors"
            >
              Add Quest
            </button>
          </div>
        )}

        <div className="space-y-3">
          {userData.weeklyQuests && userData.weeklyQuests.length > 0 ? (
            userData.weeklyQuests.map(quest => (
              <div
                key={quest.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-neon-blue/10"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={quest.completed || false}
                    onChange={() => handleQuestComplete(quest.id)}
                    className="w-5 h-5 text-neon-blue rounded focus:ring-neon-blue"
                  />
                  <span className={`flex-1 ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {quest.title}
                  </span>
                  <span className="text-sm text-neon-blue">+{quest.baseXP || quest.xpReward || 100} XP</span>
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
            <p className="text-gray-500 text-center py-4">No weekly quests yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

