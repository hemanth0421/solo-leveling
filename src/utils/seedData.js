import { CONFIG } from '../config';
import { calculateXPToNext } from './gameLogic';

/**
 * Create seeded user data for demo purposes
 */
export function createSeededUserData(username) {
  const now = new Date().toISOString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const level = 5;
  
  return {
    username,
    createdAt: now,
    lastSavedAt: now,
    level,
    xp: 250,
    xpToNext: calculateXPToNext(level),
    rank: 'E',
    stats: {
      Strength: 25,
      Endurance: 30,
      Focus: 35,
      Intelligence: 40,
      TechPower: 35,
      Communication: 20,
      CalmMind: 25,
      Willpower: 45,
    },
    fixedDailyQuests: CONFIG.fixedDailyQuests.map((q, idx) => ({
      ...q,
      completedToday: idx < 4, // First 4 completed
    })),
    userDailyQuests: [
      {
        id: 'user-1',
        title: 'Read 30 pages',
        xpReward: 30,
        penaltyIfMissed: 0,
        completed: true,
      },
      {
        id: 'user-2',
        title: 'Practice guitar',
        xpReward: 25,
        penaltyIfMissed: 0,
        completed: false,
      },
    ],
    weeklyQuests: CONFIG.defaultWeeklyQuests.map(q => ({
      ...q,
      completed: false,
      weekStart: new Date().toISOString(),
    })),
    skillTrees: {
      DSA: [
        { id: 'arrays', name: 'Arrays', description: 'Master array problems', xpPerLevel: 50, level: 3, maxLevel: 10 },
        { id: 'strings', name: 'Strings', description: 'Master string manipulation', xpPerLevel: 50, level: 2, maxLevel: 10 },
        { id: 'linkedlist', name: 'Linked Lists', description: 'Understand linked list operations', xpPerLevel: 60, level: 1, maxLevel: 10 },
        { id: 'trees', name: 'Trees', description: 'Tree data structures and algorithms', xpPerLevel: 70, level: 0, maxLevel: 10 },
      ],
      WebDev: [
        { id: 'html', name: 'HTML', description: 'HTML fundamentals', xpPerLevel: 30, level: 5, maxLevel: 10 },
        { id: 'css', name: 'CSS', description: 'CSS styling and layouts', xpPerLevel: 30, level: 4, maxLevel: 10 },
        { id: 'javascript', name: 'JavaScript', description: 'JavaScript programming', xpPerLevel: 40, level: 6, maxLevel: 10 },
        { id: 'react', name: 'React', description: 'React framework mastery', xpPerLevel: 50, level: 3, maxLevel: 10 },
      ],
      Physique: [
        { id: 'posture-drills', name: 'Posture drills', description: 'Daily posture improvement exercises', xpPerLevel: 20, level: 2, maxLevel: 10 },
        { id: 'cardio', name: 'Cardio', description: 'Cardiovascular fitness', xpPerLevel: 40, level: 1, maxLevel: 10 },
        { id: 'strength', name: 'Strength training', description: 'Build physical strength', xpPerLevel: 45, level: 0, maxLevel: 10 },
      ],
      Mind: [
        { id: 'noporn-streak', name: 'No-porn streak training', description: 'Build willpower through abstinence', xpPerLevel: 30, level: 4, maxLevel: 10 },
        { id: 'meditation', name: 'Meditation', description: 'Mindfulness and calm', xpPerLevel: 25, level: 2, maxLevel: 10 },
        { id: 'focus-training', name: 'Focus training', description: 'Improve concentration', xpPerLevel: 35, level: 1, maxLevel: 10 },
      ],
      LifeSkills: [
        { id: 'communication', name: 'Communication exercises', description: 'Improve social skills', xpPerLevel: 40, level: 1, maxLevel: 10 },
        { id: 'cooking', name: 'Cooking', description: 'Learn to cook', xpPerLevel: 30, level: 0, maxLevel: 10 },
        { id: 'finance', name: 'Personal finance', description: 'Financial literacy', xpPerLevel: 35, level: 1, maxLevel: 10 },
      ],
    },
    missions: [
      { id: 'striver', name: 'Striver A2Z', description: 'Complete Striver A2Z DSA sheet', rewardXP: 5000, progress: 15, maxProgress: 100, completed: false },
      { id: 'web-projects', name: 'Build 3 web projects', description: 'Create 3 complete web applications', rewardXP: 3000, progress: 1, maxProgress: 3, completed: false },
      { id: 'cgpa', name: 'Improve CGPA next sem', description: 'Achieve higher CGPA in next semester', rewardXP: 2000, progress: 0, maxProgress: 100, completed: false },
      { id: 'noporn-30', name: '30-day no porn', description: 'Maintain 30-day no-porn streak', rewardXP: 1500, progress: 12, maxProgress: 30, completed: false },
      { id: 'talk-crush', name: 'Talk to crush', description: 'Have a meaningful conversation', rewardXP: 1000, progress: 0, maxProgress: 1, completed: false },
      { id: 'placement', name: 'Get placed', description: 'Secure a job placement', rewardXP: 10000, progress: 0, maxProgress: 1, completed: false },
    ],
    todos: [
      { id: 'todo-1', text: 'Finish React project', xpReward: 100, penaltyIfMissed: 0, completed: false, createdAt: now },
      { id: 'todo-2', text: 'Review DSA notes', xpReward: 50, penaltyIfMissed: 0, completed: true, createdAt: yesterday.toISOString() },
      { id: 'todo-3', text: 'Call family', xpReward: 30, penaltyIfMissed: 0, completed: false, createdAt: now },
    ],
    streaks: {
      noPornDays: 12,
      dailyQuestsStreak: 3,
    },
    logs: [
      {
        timestamp: yesterday.toISOString(),
        type: 'QUEST_COMPLETE',
        message: 'Completed: Solve DSA questions',
        deltaXP: 52,
      },
      {
        timestamp: yesterday.toISOString(),
        type: 'SKILL_UNLOCK',
        message: 'WebDev: JavaScript Level 6',
        deltaXP: 42,
      },
      {
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'LEVEL_UP',
        message: 'Level Up! Now Level 5',
      },
    ],
    journal: [
      {
        timestamp: yesterday.toISOString(),
        text: 'Made good progress on DSA today. Solved 3 array problems. Feeling motivated!',
      },
      {
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        text: 'Started new React project. Excited to build something meaningful.',
      },
    ],
    settings: {
      autoPenalties: true,
      glow: true,
    },
    rankFreezeUntil: null,
    lastDayEnd: yesterday.toISOString(),
  };
}

