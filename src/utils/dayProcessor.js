import { CONFIG } from '../config';
import { applyPenalty } from './gameLogic';
import { getWeekStart } from './storage';

/**
 * Process day end - apply penalties for missed quests
 */
export function processDayEnd(userData) {
  const notifications = [];
  const fixedQuests = userData.fixedDailyQuests || [];
  const missedCount = fixedQuests.filter(q => !q.completedToday).length;
  
  let updated = { ...userData };
  
  // Reset daily quests
  updated.fixedDailyQuests = fixedQuests.map(q => ({
    ...q,
    completedToday: false,
  }));
  updated.userDailyQuests = (updated.userDailyQuests || []).map(q => ({
    ...q,
    completed: false,
  }));
  
  // Apply penalties if auto-penalties enabled
  if (updated.settings.autoPenalties && missedCount > 0) {
    let penaltyXP = 0;
    let endurancePenalty = 0;
    
    if (missedCount === 1) {
      penaltyXP = CONFIG.penalties.missedDaily1;
    } else if (missedCount === 2) {
      penaltyXP = CONFIG.penalties.missedDaily2;
    } else if (missedCount >= fixedQuests.length) {
      penaltyXP = CONFIG.penalties.missedDailyAll;
      endurancePenalty = CONFIG.penalties.missedDailyAllEndurance;
    }
    
    if (penaltyXP < 0) {
      updated = applyPenalty(updated, penaltyXP, { Endurance: endurancePenalty });
      notifications.push({
        timestamp: new Date().toISOString(),
        type: 'WARNING',
        message: `Missed ${missedCount} daily quest(s). Penalty: ${penaltyXP} XP`,
        deltaXP: penaltyXP,
      });
    }
  }
  
  // Check daily quest streak
  const allCompleted = missedCount === 0;
  if (allCompleted) {
    updated.streaks.dailyQuestsStreak = (updated.streaks.dailyQuestsStreak || 0) + 1;
    notifications.push({
      timestamp: new Date().toISOString(),
      type: 'ALERT',
      message: `Daily quest streak: ${updated.streaks.dailyQuestsStreak} days!`,
    });
  } else {
    updated.streaks.dailyQuestsStreak = 0;
  }
  
  updated.lastDayEnd = new Date().toISOString();
  
  return { userData: updated, notifications };
}

/**
 * Process week end - apply penalties for missed weekly quests
 */
export function processWeekEnd(userData) {
  const notifications = [];
  const weeklyQuests = userData.weeklyQuests || [];
  const missedCount = weeklyQuests.filter(q => !q.completed).length;
  
  let updated = { ...userData };
  
  // Reset weekly quests
  const weekStart = getWeekStart();
  updated.weeklyQuests = weeklyQuests.map(q => ({
    ...q,
    completed: false,
    weekStart,
  }));
  
  // Apply penalties if auto-penalties enabled
  if (updated.settings.autoPenalties && missedCount > 0) {
    const penaltyXP = CONFIG.penalties.missedWeekly;
    const endurancePenalty = CONFIG.penalties.missedWeeklyEndurance;
    
    updated = applyPenalty(updated, penaltyXP, { Endurance: endurancePenalty });
    notifications.push({
      timestamp: new Date().toISOString(),
      type: 'WARNING',
      message: `Missed ${missedCount} weekly quest(s). Penalty: ${penaltyXP} XP`,
      deltaXP: penaltyXP,
    });
  }
  
  return { userData: updated, notifications };
}

