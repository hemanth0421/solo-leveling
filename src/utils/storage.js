import { CONFIG } from '../config';
import { createSeededUserData } from './seedData';
import { calculateXPToNext } from './gameLogic';

const STORAGE_PREFIX = 'soloLeveling::';

/**
 * Get storage key for username
 */
export function getStorageKey(username) {
  return `${STORAGE_PREFIX}${username}`;
}

/**
 * Create default user data
 */
export function createDefaultUserData(username) {
  // Use seeded data for demo user "Hemanth"
  if (username.toLowerCase() === 'hemanth') {
    return createSeededUserData(username);
  }
  
  const now = new Date().toISOString();
  
  return {
    username,
    createdAt: now,
    lastSavedAt: now,
    level: 1,
    xp: 0,
    xpToNext: 100,
    rank: 'E',
    stats: {
      Strength: 10,
      Endurance: 10,
      Focus: 10,
      Intelligence: 10,
      TechPower: 10,
      Communication: 10,
      CalmMind: 10,
      Willpower: 10,
    },
    fixedDailyQuests: CONFIG.fixedDailyQuests.map(q => ({
      ...q,
      completedToday: false,
    })),
    userDailyQuests: [],
    weeklyQuests: CONFIG.defaultWeeklyQuests.map(q => ({
      ...q,
      completed: false,
      weekStart: getWeekStart(),
    })),
    skillTrees: {
      DSA: CONFIG.defaultSkillTrees.DSA.map(t => ({ ...t })),
      WebDev: CONFIG.defaultSkillTrees.WebDev.map(t => ({ ...t })),
      Physique: CONFIG.defaultSkillTrees.Physique.map(t => ({ ...t })),
      Mind: CONFIG.defaultSkillTrees.Mind.map(t => ({ ...t })),
      LifeSkills: CONFIG.defaultSkillTrees.LifeSkills.map(t => ({ ...t })),
    },
    missions: CONFIG.defaultMissions.map(m => ({ ...m })),
    todos: [],
    streaks: {
      noPornDays: 0,
      dailyQuestsStreak: 0,
    },
    logs: [],
    journal: [],
    settings: {
      autoPenalties: true,
      glow: true,
    },
    rankFreezeUntil: null,
    lastDayEnd: null,
  };
}

/**
 * Get week start (Monday)
 */
export function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

/**
 * Load user data from localStorage
 */
export function loadUserData(username) {
  const key = getStorageKey(username);
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  try {
    const userData = JSON.parse(data);
    // Update xpToNext in case formula changed
    userData.xpToNext = calculateXPToNext(userData.level);
    return userData;
  } catch (e) {
    console.error('Error loading user data:', e);
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUserData(userData) {
  const key = getStorageKey(userData.username);
  const updated = {
    ...userData,
    lastSavedAt: new Date().toISOString(),
    xpToNext: calculateXPToNext(userData.level),
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Error saving user data:', e);
    return false;
  }
}


/**
 * Export user data as JSON
 */
export function exportUserData(userData) {
  return JSON.stringify(userData, null, 2);
}

/**
 * Import user data from JSON
 */
export function importUserData(jsonString) {
  try {
    const userData = JSON.parse(jsonString);
    // Validate structure
    if (!userData.username || !userData.level) {
      throw new Error('Invalid user data structure');
    }
    return userData;
  } catch (e) {
    throw new Error('Invalid JSON: ' + e.message);
  }
}

/**
 * Check if it's a new day (for daily quest reset)
 */
export function isNewDay(userData) {
  if (!userData.lastDayEnd) return true;
  const lastDay = new Date(userData.lastDayEnd);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDay.setHours(0, 0, 0, 0);
  return today > lastDay;
}

/**
 * Check if it's a new week (for weekly quest reset)
 */
export function isNewWeek(userData) {
  if (!userData.weeklyQuests || userData.weeklyQuests.length === 0) return false;
  const weekStart = new Date(userData.weeklyQuests[0].weekStart);
  const now = new Date();
  const currentWeekStart = getWeekStart();
  return currentWeekStart > weekStart;
}

