export default function StatsPanel({ userData }) {
  const stats = [
    { key: 'Strength', label: 'Strength' },
    { key: 'Endurance', label: 'Endurance' },
    { key: 'Focus', label: 'Focus' },
    { key: 'Intelligence', label: 'Intelligence' },
    { key: 'TechPower', label: 'Tech Power' },
    { key: 'Communication', label: 'Communication' },
    { key: 'CalmMind', label: 'Calm Mind' },
    { key: 'Willpower', label: 'Willpower' },
  ];

  return (
    <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
      <h2 className="text-xl font-semibold text-neon-blue mb-4">Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => {
          const value = userData.stats[stat.key] || 0;
          return (
            <div key={stat.key} className="bg-gray-800/50 rounded-lg p-4 border border-neon-blue/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">{stat.label}</span>
                <span className="text-lg font-bold text-neon-blue">{value}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-neon-blue to-neon-blue-dark rounded-full transition-all duration-300 shadow-glow"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

