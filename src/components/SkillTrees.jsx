import { useState } from 'react';
import { awardXP } from '../utils/gameLogic';
import { saveUserData } from '../utils/storage';

export default function SkillTrees({ userData, updateUserData, addNotification }) {
  const [activeTree, setActiveTree] = useState('DSA');
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicXP, setNewTopicXP] = useState(50);
  const [newTopicMaxLevel, setNewTopicMaxLevel] = useState(10);

  const trees = ['DSA', 'WebDev', 'Physique', 'Mind', 'LifeSkills'];

  const handleLevelUp = (treeName, topicId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      const topic = updated.skillTrees[treeName].find(t => t.id === topicId);
      
      if (topic && topic.level < topic.maxLevel) {
        topic.level++;
        
        const result = awardXP(updated, topic.xpPerLevel, {});
        Object.assign(updated, result);
        
        updated.logs = updated.logs || [];
        updated.logs.unshift({
          timestamp: new Date().toISOString(),
          type: 'SKILL_UNLOCK',
          message: `${treeName}: ${topic.name} Level ${topic.level}`,
          deltaXP: result.xpGained,
        });
        
        addNotification({
          timestamp: new Date().toISOString(),
          type: 'SKILL_UNLOCK',
          message: `${treeName}: ${topic.name} Level ${topic.level}`,
          deltaXP: result.xpGained,
        });
      }
      
      saveUserData(updated);
      return updated;
    });
  };

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    
    updateUserData(prev => {
      const updated = { ...prev };
      updated.skillTrees[activeTree] = updated.skillTrees[activeTree] || [];
      updated.skillTrees[activeTree].push({
        id: `topic-${Date.now()}`,
        name: newTopicName,
        description: newTopicDesc,
        xpPerLevel: parseInt(newTopicXP) || 50,
        level: 0,
        maxLevel: parseInt(newTopicMaxLevel) || 10,
      });
      saveUserData(updated);
      return updated;
    });
    
    setNewTopicName('');
    setNewTopicDesc('');
    setNewTopicXP(50);
    setNewTopicMaxLevel(10);
    setShowAddTopic(false);
  };

  const handleDeleteTopic = (treeName, topicId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      updated.skillTrees[treeName] = (updated.skillTrees[treeName] || []).filter(t => t.id !== topicId);
      saveUserData(updated);
      return updated;
    });
  };

  const handleEditTopic = (treeName, topicId, field, value) => {
    updateUserData(prev => {
      const updated = { ...prev };
      const topic = updated.skillTrees[treeName].find(t => t.id === topicId);
      if (topic) {
        topic[field] = value;
      }
      saveUserData(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neon-blue">Skill Trees</h2>

      {/* Tree Selector */}
      <div className="flex gap-2 flex-wrap">
        {trees.map(tree => (
          <button
            key={tree}
            onClick={() => setActiveTree(tree)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTree === tree
                ? 'bg-neon-blue text-navy-dark font-semibold'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tree}
          </button>
        ))}
      </div>

      {/* Add Topic */}
      <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neon-blue">{activeTree} Skill Tree</h3>
          <button
            onClick={() => setShowAddTopic(!showAddTopic)}
            className="px-4 py-2 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors text-sm font-semibold"
          >
            {showAddTopic ? 'Cancel' : '+ Add Topic'}
          </button>
        </div>

        {showAddTopic && (
          <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-neon-blue/10">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Topic name"
              className="w-full mb-2 px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
            />
            <input
              type="text"
              value={newTopicDesc}
              onChange={(e) => setNewTopicDesc(e.target.value)}
              placeholder="Description"
              className="w-full mb-2 px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newTopicXP}
                onChange={(e) => setNewTopicXP(e.target.value)}
                placeholder="XP per level"
                className="px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
              />
              <input
                type="number"
                value={newTopicMaxLevel}
                onChange={(e) => setNewTopicMaxLevel(e.target.value)}
                placeholder="Max level"
                className="px-3 py-2 bg-gray-700 border border-neon-blue/30 rounded text-white"
              />
            </div>
            <button
              onClick={handleAddTopic}
              className="mt-2 w-full px-4 py-2 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark transition-colors"
            >
              Add Topic
            </button>
          </div>
        )}

        {/* Topics List */}
        <div className="space-y-3">
          {userData.skillTrees[activeTree] && userData.skillTrees[activeTree].length > 0 ? (
            userData.skillTrees[activeTree].map(topic => (
              <div
                key={topic.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-neon-blue/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{topic.name}</h4>
                    <p className="text-sm text-gray-400">{topic.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTopic(activeTree, topic.id)}
                    className="ml-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Level</span>
                      <span className="text-neon-blue font-semibold">
                        {topic.level} / {topic.maxLevel}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-full bg-neon-blue rounded-full transition-all duration-300"
                        style={{ width: `${(topic.level / topic.maxLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleLevelUp(activeTree, topic.id)}
                    disabled={topic.level >= topic.maxLevel}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      topic.level >= topic.maxLevel
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-neon-blue text-navy-dark hover:bg-neon-blue-dark'
                    }`}
                  >
                    Level Up (+{topic.xpPerLevel} XP)
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No topics in this tree yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

