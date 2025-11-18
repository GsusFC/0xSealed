import { DiaryEntry, UserStats, UserSettings } from "../types";

const STORAGE_KEY = "sealed_diary_entries";
const SETTINGS_KEY = "sealed_user_settings";

// Simple hashing simulation
const generateHash = async (content: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(content + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `0x${hashHex.substring(0, 40)}`; // Simulate an ETH/Base address style hash
};

export const saveEntry = async (content: string, sentiment: string, reflection: string): Promise<DiaryEntry> => {
  const existing = getEntries();
  const hash = await generateHash(content);
  
  const newEntry: DiaryEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    content,
    sentiment,
    aiReflection: reflection,
    hash,
    isSealed: true
  };

  const updated = [newEntry, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
};

export const getEntries = (): DiaryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const deleteEntry = (id: string): void => {
  const existing = getEntries();
  const updated = existing.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// Settings Management
export const getUserSettings = (): UserSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return {
    theme: 'dark',
    username: 'ANONYMOUS',
    walletAddress: null
  };
};

export const saveUserSettings = (settings: UserSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  // We optionally keep settings or clear them too. Let's clear everything but maybe re-init settings.
  const defaultSettings = { theme: 'dark', username: 'ANONYMOUS', walletAddress: null };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
};


const LEVELS = [
  { name: "Echo", threshold: 0 },
  { name: "Whisper", threshold: 500 },
  { name: "Scribe", threshold: 1500 },
  { name: "Chronicler", threshold: 3500 },
  { name: "Philosopher", threshold: 7000 },
  { name: "Voidwalker", threshold: 12000 },
];

export const getUserStats = (): UserStats => {
  const entries = getEntries();
  
  // 1. Basic Counts
  const totalEntries = entries.length;
  const totalWords = entries.reduce((acc, entry) => acc + entry.content.trim().split(/\s+/).length, 0);

  // 2. Calculate Streak
  // Sort entries by date ascending
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  let currentStreak = 0;
  
  if (sortedEntries.length > 0) {
    const uniqueDates = new Set(sortedEntries.map(e => new Date(e.timestamp).toDateString()));
    const sortedUniqueDates = Array.from(uniqueDates).map(d => new Date(d));
    
    // Check if the user wrote today or yesterday to keep streak alive
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastEntryDate = sortedUniqueDates[sortedUniqueDates.length - 1];
    const isToday = lastEntryDate.toDateString() === today.toDateString();
    const isYesterday = lastEntryDate.toDateString() === yesterday.toDateString();

    if (isToday || isYesterday) {
      currentStreak = 1;
      // Iterate backwards to find consecutive days
      for (let i = sortedUniqueDates.length - 1; i > 0; i--) {
        const curr = sortedUniqueDates[i];
        const prev = sortedUniqueDates[i - 1];
        const diffTime = Math.abs(curr.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // 3. Calculate Points
  // Rule: 100 pts per entry + 1 pt per word + 50 pts per streak day
  let voidPoints = (totalEntries * 100) + totalWords + (currentStreak * 50);

  // 4. Determine Level
  let level = LEVELS[0];
  let nextLevel = LEVELS[1]; // Default to next
  
  for (let i = 0; i < LEVELS.length; i++) {
    if (voidPoints >= LEVELS[i].threshold) {
      level = LEVELS[i];
      nextLevel = LEVELS[i + 1] || { name: "Ascended", threshold: voidPoints * 2 };
    }
  }

  const pointsInLevel = voidPoints - level.threshold;
  const pointsNeeded = nextLevel.threshold - level.threshold;
  const progress = Math.min(100, Math.max(0, (pointsInLevel / pointsNeeded) * 100));

  return {
    totalEntries,
    totalWords,
    currentStreak,
    voidPoints,
    level: level.name,
    nextLevelPoints: nextLevel.threshold,
    progress
  };
};