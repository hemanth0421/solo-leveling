import { calculateXPToNext } from '../utils/gameLogic';

export default function Header({ userData, onLogout }) {
  const xpProgress = (userData.xp / userData.xpToNext) * 100;

  return (
    <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-neon-blue">SoloLeveling</h1>
          <p className="text-gray-400 text-sm">Welcome, {userData.username}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            Rank <span className="text-neon-blue">{userData.rank}</span> • Level <span className="text-neon-blue">{userData.level}</span>
          </div>
          {userData.rankFreezeUntil && new Date(userData.rankFreezeUntil) > new Date() && (
            <div className="text-xs text-red-400 mt-1">
              Rank progression frozen until {new Date(userData.rankFreezeUntil).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>XP: {userData.xp} / {userData.xpToNext}</span>
          <span>Total XP: {userData.xp + userData.level * 100}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-blue-dark transition-all duration-500 shadow-glow"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <button
        onClick={onLogout}
        className="text-sm text-gray-400 hover:text-neon-blue transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

