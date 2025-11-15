// Configuration file for XP, penalties, and stat multipliers
export const CONFIG = {
  // XP Multiplier calculation
  xpMultiplier: {
    enduranceWeight: 200,
    willpowerWeight: 300,
  },
  
  // Level XP thresholds
  levelXP: {
    base: 100,
    multiplier: 1.25,
  },
  
  // Rank thresholds (level ranges)
  ranks: {
    E: { min: 1, max: 9 },
    D: { min: 10, max: 19 },
    C: { min: 20, max: 29 },
    B: { min: 30, max: 39 },
    A: { min: 40, max: 49 },
    S: { min: 50, max: 60 },
    SS: { min: 61, max: 80 },
    Shadow: { min: 81, max: Infinity },
  },
  
  // Penalties
  penalties: {
    missedDaily1: -30,
    missedDaily2: -60,
    missedDailyAll: -150,
    missedDailyAllEndurance: -5,
    missedWeekly: -200,
    missedWeeklyEndurance: -5,
    pornRelapse: {
      xp: -100,
      willpowerReset: true,
      willpowerValue: 0,
      endurance: -5,
      rankFreezeHours: 48,
    },
  },
  
  // Stat boosts on task completion
  statBoosts: {
    posture: { Strength: 1 },
    noPorn: { Willpower: 3 },
    exercise: { Endurance: 2, Strength: 1 },
    study: { Intelligence: 1, Focus: 1 },
    dsa: { Intelligence: 2, Focus: 1 },
  },
  
  // Fixed daily quests
  fixedDailyQuests: [
    { id: 'dsa', title: 'Solve DSA questions (1-3 based on level)', baseXP: 50 },
    { id: 'webdev', title: 'Web Dev study (45 min)', baseXP: 40 },
    { id: 'academic', title: 'Academic revision (20 min)', baseXP: 30 },
    { id: 'exercise', title: 'Walk or exercise (20 min)', baseXP: 35 },
    { id: 'noporn', title: 'No porn', baseXP: 25 },
    { id: 'nodoomscroll', title: 'No doomscrolling (>30 min)', baseXP: 20 },
    { id: 'posture', title: '10 min posture work', baseXP: 15 },
  ],
  
  // Default weekly quests
  defaultWeeklyQuests: [
    { id: 'weekly-review', title: 'Weekly review and planning', baseXP: 100 },
    { id: 'social-interaction', title: 'Meaningful social interaction', baseXP: 80 },
  ],
  
  // Default missions
  defaultMissions: [
    { id: 'striver', name: 'Striver A2Z', description: 'Complete Striver A2Z DSA sheet', rewardXP: 5000, progress: 0, maxProgress: 100 },
    { id: 'web-projects', name: 'Build 3 web projects', description: 'Create 3 complete web applications', rewardXP: 3000, progress: 0, maxProgress: 3 },
    { id: 'cgpa', name: 'Improve CGPA next sem', description: 'Achieve higher CGPA in next semester', rewardXP: 2000, progress: 0, maxProgress: 100 },
    { id: 'noporn-30', name: '30-day no porn', description: 'Maintain 30-day no-porn streak', rewardXP: 1500, progress: 0, maxProgress: 30 },
    { id: 'talk-crush', name: 'Talk to crush', description: 'Have a meaningful conversation', rewardXP: 1000, progress: 0, maxProgress: 1 },
    { id: 'placement', name: 'Get placed', description: 'Secure a job placement', rewardXP: 10000, progress: 0, maxProgress: 1 },
  ],
  
  // Default skill tree topics
  defaultSkillTrees: {
    DSA: [
      { id: 'arrays', name: 'Arrays', description: 'Master array problems', xpPerLevel: 50, level: 0, maxLevel: 10 },
      { id: 'strings', name: 'Strings', description: 'Master string manipulation', xpPerLevel: 50, level: 0, maxLevel: 10 },
      { id: 'linkedlist', name: 'Linked Lists', description: 'Understand linked list operations', xpPerLevel: 60, level: 0, maxLevel: 10 },
      { id: 'trees', name: 'Trees', description: 'Tree data structures and algorithms', xpPerLevel: 70, level: 0, maxLevel: 10 },
    ],
    WebDev: [
      { id: 'html', name: 'HTML', description: 'HTML fundamentals', xpPerLevel: 30, level: 0, maxLevel: 10 },
      { id: 'css', name: 'CSS', description: 'CSS styling and layouts', xpPerLevel: 30, level: 0, maxLevel: 10 },
      { id: 'javascript', name: 'JavaScript', description: 'JavaScript programming', xpPerLevel: 40, level: 0, maxLevel: 10 },
      { id: 'react', name: 'React', description: 'React framework mastery', xpPerLevel: 50, level: 0, maxLevel: 10 },
    ],
    Physique: [
      { id: 'posture-drills', name: 'Posture drills', description: 'Daily posture improvement exercises', xpPerLevel: 20, level: 0, maxLevel: 10 },
      { id: 'cardio', name: 'Cardio', description: 'Cardiovascular fitness', xpPerLevel: 40, level: 0, maxLevel: 10 },
      { id: 'strength', name: 'Strength training', description: 'Build physical strength', xpPerLevel: 45, level: 0, maxLevel: 10 },
    ],
    Mind: [
      { id: 'noporn-streak', name: 'No-porn streak training', description: 'Build willpower through abstinence', xpPerLevel: 30, level: 0, maxLevel: 10 },
      { id: 'meditation', name: 'Meditation', description: 'Mindfulness and calm', xpPerLevel: 25, level: 0, maxLevel: 10 },
      { id: 'focus-training', name: 'Focus training', description: 'Improve concentration', xpPerLevel: 35, level: 0, maxLevel: 10 },
    ],
    LifeSkills: [
      { id: 'communication', name: 'Communication exercises', description: 'Improve social skills', xpPerLevel: 40, level: 0, maxLevel: 10 },
      { id: 'cooking', name: 'Cooking', description: 'Learn to cook', xpPerLevel: 30, level: 0, maxLevel: 10 },
      { id: 'finance', name: 'Personal finance', description: 'Financial literacy', xpPerLevel: 35, level: 0, maxLevel: 10 },
    ],
  },
};

