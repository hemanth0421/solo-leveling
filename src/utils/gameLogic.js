import { CONFIG } from '../config';

/**
 * Calculate XP multiplier based on stats
 */
export function calculateXPMultiplier(endurance, willpower) {
  const enduranceBonus = (endurance - 50) / CONFIG.xpMultiplier.enduranceWeight;
  const willpowerBonus = (willpower - 50) / CONFIG.xpMultiplier.willpowerWeight;
  return 1 + enduranceBonus + willpowerBonus;
}

/**
 * Calculate XP required for next level
 */
export function calculateXPToNext(level) {
  return Math.floor(CONFIG.levelXP.base * Math.pow(CONFIG.levelXP.multiplier, level - 1));
}

/**
 * Get rank from level
 */
export function getRankFromLevel(level) {
  for (const [rank, range] of Object.entries(CONFIG.ranks)) {
    if (level >= range.min && level <= range.max) {
      return rank;
    }
  }
  return 'E';
}

/**
 * Check if rank progression is frozen (porn relapse penalty)
 */
export function isRankFrozen(userData) {
  if (!userData.rankFreezeUntil) return false;
  return new Date(userData.rankFreezeUntil) > new Date();
}

/**
 * Award XP and update level/rank
 */
export function awardXP(userData, baseXP, statBoosts = {}) {
  const multiplier = calculateXPMultiplier(userData.stats.Endurance, userData.stats.Willpower);
  const xpGained = Math.floor(baseXP * multiplier);
  
  let newXP = userData.xp + xpGained;
  let newLevel = userData.level;
  let newRank = userData.rank;
  let leveledUp = false;
  let rankedUp = false;
  
  // Check for level up
  while (newXP >= calculateXPToNext(newLevel)) {
    newXP -= calculateXPToNext(newLevel);
    newLevel++;
    leveledUp = true;
    
    // Check for rank up (if not frozen)
    if (!isRankFrozen(userData)) {
      const potentialRank = getRankFromLevel(newLevel);
      if (potentialRank !== newRank) {
        newRank = potentialRank;
        rankedUp = true;
      }
    }
  }
  
  // Apply stat boosts
  const newStats = { ...userData.stats };
  for (const [stat, value] of Object.entries(statBoosts)) {
    if (newStats[stat] !== undefined) {
      newStats[stat] = Math.min(100, Math.max(0, newStats[stat] + value));
    }
  }
  
  return {
    xp: newXP,
    level: newLevel,
    rank: newRank,
    stats: newStats,
    xpGained,
    leveledUp,
    rankedUp,
  };
}

/**
 * Apply penalty
 */
export function applyPenalty(userData, penaltyXP, statChanges = {}) {
  let newXP = Math.max(0, userData.xp + penaltyXP);
  let newLevel = userData.level;
  let newRank = userData.rank;
  
  // Recalculate level if XP went down
  while (newXP < 0 && newLevel > 1) {
    newLevel--;
    newXP += calculateXPToNext(newLevel);
  }
  
  // Recalculate rank
  newRank = getRankFromLevel(newLevel);
  
  // Apply stat changes
  const newStats = { ...userData.stats };
  for (const [stat, value] of Object.entries(statChanges)) {
    if (newStats[stat] !== undefined) {
      newStats[stat] = Math.min(100, Math.max(0, newStats[stat] + value));
    }
  }
  
  return {
    xp: Math.max(0, newXP),
    level: Math.max(1, newLevel),
    rank: newRank,
    stats: newStats,
  };
}

/**
 * Apply porn relapse penalty
 */
export function applyPornRelapse(userData) {
  const penalty = CONFIG.penalties.pornRelapse;
  const freezeUntil = new Date();
  freezeUntil.setHours(freezeUntil.getHours() + penalty.rankFreezeHours);
  
  const updated = applyPenalty(
    userData,
    penalty.xp,
    {
      Willpower: penalty.willpowerReset ? -userData.stats.Willpower : penalty.endurance,
      Endurance: penalty.endurance,
    }
  );
  
  return {
    ...updated,
    rankFreezeUntil: freezeUntil.toISOString(),
    streaks: {
      ...userData.streaks,
      noPornDays: 0,
    },
  };
}

/**
 * Get stat boost for a task
 */
export function getStatBoostForTask(taskId) {
  const taskMap = {
    posture: CONFIG.statBoosts.posture,
    noporn: CONFIG.statBoosts.noPorn,
    exercise: CONFIG.statBoosts.exercise,
    webdev: CONFIG.statBoosts.study,
    academic: CONFIG.statBoosts.study,
    dsa: CONFIG.statBoosts.dsa,
  };
  return taskMap[taskId] || {};
}

