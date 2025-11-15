import { useState, useEffect } from 'react';
import { saveUserData, isNewDay, isNewWeek } from '../utils/storage';
import Header from './Header';
import StatsPanel from './StatsPanel';
import DailyQuests from './DailyQuests';
import WeeklyQuests from './WeeklyQuests';
import SkillTrees from './SkillTrees';
import Missions from './Missions';
import Todos from './Todos';
import Journal from './Journal';
import Settings from './Settings';
import AdminPanel from './AdminPanel';
import Notifications from './Notifications';
import { processDayEnd, processWeekEnd } from '../utils/dayProcessor';

export default function Dashboard({ userData, setUserData, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAdmin, setShowAdmin] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Check for day/week rollover on mount
  useEffect(() => {
    let updated = { ...userData };
    let changed = false;

    if (isNewDay(userData)) {
      const result = processDayEnd(updated);
      updated = result.userData;
      if (result.notifications.length > 0) {
        setNotifications(prev => [...result.notifications, ...prev]);
      }
      changed = true;
    }

    if (isNewWeek(updated)) {
      const result = processWeekEnd(updated);
      updated = result.userData;
      if (result.notifications.length > 0) {
        setNotifications(prev => [...result.notifications, ...prev]);
      }
      changed = true;
    }

    if (changed) {
      setUserData(updated);
      saveUserData(updated);
    }
  }, []);

  const updateUserData = (updater) => {
    setUserData(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater;
      saveUserData(updated);
      return updated;
    });
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50));
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'daily', label: 'Daily Quests' },
    { id: 'weekly', label: 'Weekly Quests' },
    { id: 'skills', label: 'Skill Trees' },
    { id: 'missions', label: 'Missions' },
    { id: 'todos', label: 'To-Do List' },
    { id: 'journal', label: 'Journal' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-navy-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/50 border-r border-neon-blue/20 p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neon-blue">SoloLeveling</h2>
          <p className="text-sm text-gray-400">{userData.username}</p>
        </div>

        <nav className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:text-gray-400"
          >
            {showAdmin ? 'Hide' : 'Show'} Admin
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <Header userData={userData} onLogout={onLogout} />
              <StatsPanel userData={userData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-4">
                  <h3 className="text-lg font-semibold text-neon-blue mb-3">Quick Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">No-Porn Streak:</span>
                      <span className="text-white font-semibold">{userData.streaks.noPornDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Daily Quest Streak:</span>
                      <span className="text-white font-semibold">{userData.streaks.dailyQuestsStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Completed Quests:</span>
                      <span className="text-white font-semibold">
                        {userData.logs.filter(l => l.type === 'QUEST_COMPLETE').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Penalties:</span>
                      <span className="text-red-400 font-semibold">
                        {userData.logs.filter(l => l.type === 'PENALTY').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <DailyQuests
              userData={userData}
              updateUserData={updateUserData}
              addNotification={addNotification}
            />
          )}

          {activeTab === 'weekly' && (
            <WeeklyQuests
              userData={userData}
              updateUserData={updateUserData}
              addNotification={addNotification}
            />
          )}

          {activeTab === 'skills' && (
            <SkillTrees
              userData={userData}
              updateUserData={updateUserData}
              addNotification={addNotification}
            />
          )}

          {activeTab === 'missions' && (
            <Missions
              userData={userData}
              updateUserData={updateUserData}
              addNotification={addNotification}
            />
          )}

          {activeTab === 'todos' && (
            <Todos
              userData={userData}
              updateUserData={updateUserData}
              addNotification={addNotification}
            />
          )}

          {activeTab === 'journal' && (
            <Journal
              userData={userData}
              updateUserData={updateUserData}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
        </div>

        {/* Right Sidebar - Notifications */}
        <div className="w-80 bg-gray-900/30 border-l border-neon-blue/20 p-4">
          <Notifications
            notifications={notifications}
            userData={userData}
          />
        </div>
      </div>

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel
          userData={userData}
          updateUserData={updateUserData}
          addNotification={addNotification}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
}

