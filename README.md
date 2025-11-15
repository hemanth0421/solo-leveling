# SoloLeveling - Life Progression System

A single-page web application inspired by Solo Leveling, designed as a personal life progression and productivity system. Track your daily habits, skill development, missions, and stats with a gamified XP and ranking system.

## Features

- **Daily & Weekly Quests**: Complete fixed and custom quests to earn XP
- **Skill Trees**: Track progress in DSA, Web Dev, Physique, Mind, and Life Skills
- **Missions**: Long-term goals with progress tracking
- **To-Do List**: Customizable tasks with XP rewards
- **Stats System**: 8 core stats (Strength, Endurance, Focus, Intelligence, Tech Power, Communication, Calm Mind, Willpower)
- **Ranking System**: Progress from Rank E to Shadow Monarch
- **Penalties**: Automatic and manual penalty system with strict rules
- **Journal**: Personal journaling with timestamps
- **Export/Import**: Backup and restore your data as JSON
- **LocalStorage**: All data stored locally in your browser

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **LocalStorage** for data persistence
- No backend required - fully static site

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
# or
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Usage

### Getting Started

1. Enter a username on the welcome screen
2. If the username exists, your saved data will load
3. If it's a new username, a fresh profile will be created

### Daily Quests

- Complete fixed daily quests (DSA, Web Dev, Academic, Exercise, No Porn, No Doomscrolling, Posture)
- Add custom daily quests with custom XP rewards and penalties
- Click "End Day" to process missed quests and apply penalties (if auto-penalties enabled)

### Weekly Quests

- Complete weekly quests before the week ends
- Add custom weekly quests
- Click "Complete Week" to process missed quests

### Skill Trees

- Select a skill tree (DSA, WebDev, Physique, Mind, LifeSkills)
- Add custom topics to any tree
- Level up topics to earn XP
- Each level completion awards XP based on the topic's `xpPerLevel` value

### Missions

- Track long-term goals with progress bars
- Update progress manually with +/- buttons
- Completing a mission awards large XP bonuses
- Add custom missions with custom rewards

### To-Do List

- Add todos with optional XP rewards and penalties
- Mark todos as complete to earn XP
- Uncompleted todos with penalties will apply penalties at day end (if auto-penalties enabled)

### Penalties

**Automatic Penalties** (enabled by default):
- Miss 1 fixed daily quest: -30 XP
- Miss 2 fixed daily quests: -60 XP
- Miss all fixed daily quests: -150 XP and -5 Endurance
- Miss weekly quests: -200 XP and -5 Endurance

**Porn Relapse Penalty** (very strict):
- -100 XP
- Willpower reset to 0
- Rank progression frozen for 48 hours
- -5 Endurance
- No-porn streak reset to 0

**Manual Penalties**:
- Use the Admin panel to apply custom penalties for testing

### Stats

Stats increase when completing relevant tasks:
- Posture work: +1 Strength
- No porn day: +3 Willpower
- Exercise: +2 Endurance, +1 Strength
- Study tasks: +1 Intelligence, +1 Focus
- DSA: +2 Intelligence, +1 Focus

### Ranking System

- **Rank E**: Levels 1-9
- **Rank D**: Levels 10-19
- **Rank C**: Levels 20-29
- **Rank B**: Levels 30-39
- **Rank A**: Levels 40-49
- **Rank S**: Levels 50-60
- **Rank SS**: Levels 61-80
- **Shadow Monarch**: Level 81+

### XP & Leveling

- XP multiplier based on Endurance and Willpower stats
- Level XP thresholds: `100 * 1.25^(level-1)`
- Leveling up automatically checks for rank progression (unless frozen)

### Export/Import

**Export**:
1. Go to Settings
2. Click "Export Data"
3. A JSON file will download with all your data

**Import**:
1. Go to Settings
2. Either paste JSON in the textarea or select a JSON file
3. Click "Import JSON" or "Import File"
4. Your data will be restored

### Admin/Debug Panel

Access the admin panel by clicking "Show Admin" in the sidebar. This panel allows:
- Award XP manually
- Apply penalties manually
- Simulate porn relapse
- Simulate day/week end

**Note**: This is for testing and debugging only.

## Data Storage

All data is stored in your browser's localStorage with the key format: `soloLeveling::<username>`

**Important**: 
- Data is stored locally on your device
- Clearing browser cache/data will erase your progress
- Export your data regularly as backup
- Data is not synced across devices or browsers

## Configuration

Edit `src/config.js` to adjust:
- XP multipliers
- Level XP thresholds
- Rank thresholds
- Penalty amounts
- Stat boosts
- Default quests, missions, and skill trees

## Deployment

### Static Hosting

Build the project:
```bash
npm run build
```

The `dist` folder contains the static files ready for deployment to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`

### Vercel

1. Framework preset: Vite
2. Build command: `npm run build`
3. Output directory: `dist`

## Development

### Project Structure

```
src/
├── components/       # React components
│   ├── Welcome.jsx
│   ├── Dashboard.jsx
│   ├── Header.jsx
│   ├── StatsPanel.jsx
│   ├── DailyQuests.jsx
│   ├── WeeklyQuests.jsx
│   ├── SkillTrees.jsx
│   ├── Missions.jsx
│   ├── Todos.jsx
│   ├── Journal.jsx
│   ├── Settings.jsx
│   ├── Notifications.jsx
│   ├── AdminPanel.jsx
│   └── PornRelapseModal.jsx
├── utils/           # Utility functions
│   ├── gameLogic.js    # XP, level, rank calculations
│   ├── storage.js      # LocalStorage operations
│   └── dayProcessor.js # Day/week end processing
├── config.js        # Configuration constants
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## License

This project is open source and available for personal use.

## Notes

- The app automatically checks for day/week rollover on load
- All state changes are immediately saved to localStorage
- Notifications show the latest 10 system messages
- The UI uses a dark navy theme with neon-blue accents for the Solo Leveling vibe

