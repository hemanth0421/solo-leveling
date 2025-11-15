import { useEffect, useState } from 'react';

export default function Notifications({ notifications, userData }) {
  const [visible, setVisible] = useState(true);

  const systemLogs = userData.logs || [];
  const allNotifications = [...notifications, ...systemLogs]
    .sort((a, b) => new Date(b.timestamp || b.time || 0) - new Date(a.timestamp || a.time || 0))
    .slice(0, 10);

  const getBadgeColor = (type) => {
    switch (type) {
      case 'ALERT':
      case 'SKILL_UNLOCK':
      case 'RANK_UP':
      case 'LEVEL_UP':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'WARNING':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'DANGER':
      case 'PENALTY':
      case 'RELAPSE':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neon-blue">Notifications</h3>
        <button
          onClick={() => setVisible(!visible)}
          className="text-xs text-gray-400 hover:text-neon-blue"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>

      {visible && (
        <div className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto">
          {allNotifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No notifications yet</p>
          ) : (
            allNotifications.map((notif, idx) => {
              const time = notif.timestamp || notif.time || new Date().toISOString();
              const date = new Date(time);
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getBadgeColor(notif.type)} text-sm`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold text-xs uppercase">{notif.type || 'INFO'}</span>
                    <span className="text-xs opacity-70">
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs">{notif.message || notif.text || 'No message'}</p>
                  {notif.deltaXP !== undefined && (
                    <p className={`text-xs mt-1 font-semibold ${notif.deltaXP >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {notif.deltaXP >= 0 ? '+' : ''}{notif.deltaXP} XP
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

