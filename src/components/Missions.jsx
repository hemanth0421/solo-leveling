import { useState } from 'react';
import { awardXP } from '../utils/gameLogic';
import { saveUserData } from '../utils/storage';

export default function Missions({ userData, updateUserData, addNotification }) {
  const [showAddMission, setShowAddMission] = useState(false);
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionDesc, setNewMissionDesc] = useState('');
  const [newMissionXP, setNewMissionXP] = useState(1000);
  const [newMissionProgress, setNewMissionProgress] = useState(0);
  const [newMissionMax, setNewMissionMax] = useState(100);

  const handleProgressUpdate = (missionId, delta) => {
    updateUserData(prev => {
      const updated = { ...prev };
      const mission = updated.missions.find(m => m.id === missionId);
      
      if (mission && !mission.completed) {
        mission.progress = Math.min(mission.maxProgress || 100, Math.max(0, (mission.progress || 0) + delta));
        
        if (mission.progress >= (mission.maxProgress || 100) && !mission.completed) {
          mission.completed = true;
          
          const result = awardXP(updated, mission.rewardXP || 1000, {});
          Object.assign(updated, result);
          
          updated.logs = updated.logs || [];
          updated.logs.unshift({
            timestamp: new Date().toISOString(),
            type: 'MISSION_COMPLETE',
            message: `Mission completed: ${mission.name}`,
            deltaXP: result.xpGained,
          });
          
          addNotification({
            timestamp: new Date().toISOString(),
            type: 'ALERT',
            message: `Mission completed: ${mission.name}`,
            deltaXP: result.xpGained,
          });
        }
      }
      
      saveUserData(updated);
      return updated;
    });
  };

  const handleAddMission = () => {
    if (!newMissionName.trim()) return;
    
    updateUserData(prev => {
      const updated = { ...prev };
      updated.missions = updated.missions || [];
      updated.missions.push({
        id: `mission-${Date.now()}`,
        name: newMissionName,
        description: newMissionDesc,
        rewardXP: parseInt(newMissionXP) || 1000,
        progress: parseInt(newMissionProgress) || 0,
        maxProgress: parseInt(newMissionMax) || 100,
        completed: false,
      });
      saveUserData(updated);
      return updated;
    });
    
    setNewMissionName('');
    setNewMissionDesc('');
    setNewMissionXP(1000);
    setNewMissionProgress(0);
    setNewMissionMax(100);
    setShowAddMission(false);
  };

  const handleDeleteMission = (missionId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      updated.missions = (updated.missions || []).filter(m => m.id !== missionId);
      saveUserData(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-blue">Missions</h2>
        <button
          onClick={() => setShowAddMission(!showAddMission)}
          className="px-4 py-2 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors text-sm font-semibold"
        >
          {showAddMission ? 'Cancel' : '+ Add Mission'}
        </button>
      </div>

      {showAddMission && (
        <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
          <h3 className="text-lg font-semibold text-neon-blue mb-4">Add New Mission</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newMissionName}
              onChange={(e) => setNewMissionName(e.target.value)}
              placeholder="Mission name"
              className="w-full px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
            />
            <input
              type="text"
              value={newMissionDesc}
              onChange={(e) => setNewMissionDesc(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={newMissionXP}
                onChange={(e) => setNewMissionXP(e.target.value)}
                placeholder="XP Reward"
                className="px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
              />
              <input
                type="number"
                value={newMissionProgress}
                onChange={(e) => setNewMissionProgress(e.target.value)}
                placeholder="Current progress"
                className="px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
              />
              <input
                type="number"
                value={newMissionMax}
                onChange={(e) => setNewMissionMax(e.target.value)}
                placeholder="Max progress"
                className="px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
              />
            </div>
            <button
              onClick={handleAddMission}
              className="w-full px-4 py-2 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark transition-colors font-semibold"
            >
              Add Mission
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {userData.missions && userData.missions.length > 0 ? (
          userData.missions.map(mission => (
            <div
              key={mission.id}
              className={`bg-gray-900/50 rounded-lg border p-6 ${
                mission.completed
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-neon-blue/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {mission.name}
                    {mission.completed && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">COMPLETED</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{mission.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteMission(mission.id)}
                  className="ml-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-neon-blue font-semibold">
                    {mission.progress || 0} / {mission.maxProgress || 100}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      mission.completed
                        ? 'bg-green-500'
                        : 'bg-gradient-to-r from-neon-blue to-neon-blue-dark'
                    }`}
                    style={{ width: `${Math.min(100, ((mission.progress || 0) / (mission.maxProgress || 100)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Reward: <span className="text-neon-blue font-semibold">+{mission.rewardXP} XP</span></span>
                {!mission.completed && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProgressUpdate(mission.id, -10)}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 text-sm"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handleProgressUpdate(mission.id, -1)}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 text-sm"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleProgressUpdate(mission.id, 1)}
                      className="px-3 py-1 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark text-sm font-semibold"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleProgressUpdate(mission.id, 10)}
                      className="px-3 py-1 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark text-sm font-semibold"
                    >
                      +10
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No missions yet</p>
        )}
      </div>
    </div>
  );
}

