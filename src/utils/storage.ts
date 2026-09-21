import { UserAccount, UserProgress, EnglishLevel, TestScoreHistory } from '../types';

const USERS_STORAGE_KEY = 'ilmhub_english_users_v2';
const CURRENT_USER_ID_KEY = 'ilmhub_english_current_user_id_v2';
const THEME_STORAGE_KEY = 'ilmhub_english_theme';

export const INITIAL_ADMIN_USERNAME = 'humoyun_fjx';
export const ADMIN_SECURITY_CODE = '123';

const DEFAULT_ADMIN_PASSWORD = 'admin_fjx_secure';

const INITIAL_PROGRESS: UserProgress = {
  xp: 120,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: ['l-a1-1-1'],
  masteredVocab: ['v-a1-1', 'v-a1-2'],
  reviewVocab: ['v-a1-3'],
  favoriteVocab: ['v-a1-1'],
  testScores: [
    {
      id: 'score-init-1',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      testSize: 10,
      score: 9,
      totalQuestions: 10,
      percentage: 90,
      level: 'B1',
      timeSpentSeconds: 245
    }
  ],
  unlockedAchievements: ['ach-first-step', 'ach-vocab-5'],
  currentLevel: 'B1',
  dailyGoalXp: 50,
  todayXp: 35
};

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    username: INITIAL_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
    fullName: 'Khumoyun Abduvaliyev',
    email: 'humoyunabduvaliyev265@gmail.com',
    role: 'admin',
    isActive: true,
    createdAt: '2026-01-15T10:00:00Z',
    lastLoginAt: new Date().toISOString(),
    level: 'C2',
    progress: {
      ...INITIAL_PROGRESS,
      xp: 850,
      streakDays: 14,
      currentLevel: 'C2',
      todayXp: 50
    },
    notes: 'Platform Administrator'
  }
];

export function getStoredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    let parsed: UserAccount[] = JSON.parse(raw);

    // Remove legacy auto-seeded demo accounts (users must NOT be created automatically)
    parsed = parsed.filter(u => !['usr-student-1', 'usr-student-2', 'usr-student-3'].includes(u.id));

    // Ensure admin exists
    if (!parsed.some(u => u.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase())) {
      parsed.unshift(INITIAL_USERS[0]);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_USER_ID_KEY);
}

export function getCurrentUser(): UserAccount | null {
  const id = getCurrentUserId();
  if (!id) return null;
  const users = getStoredUsers();
  return users.find(u => u.id === id && u.isActive) || null;
}

export function logoutUser(): void {
  setCurrentUserId(null);
}

export function setCurrentUserId(userId: string | null): void {
  if (typeof window === 'undefined') return;
  if (userId) {
    localStorage.setItem(CURRENT_USER_ID_KEY, userId);
  } else {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('ilmhub_theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  localStorage.setItem('ilmhub_theme', theme);
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    document.body?.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    document.body?.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

export function createUserAccount(data: {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  level: EnglishLevel;
  isActive: boolean;
  notes?: string;
}): { success: boolean; error?: string; user?: UserAccount } {
  const users = getStoredUsers();
  const trimmedUsername = data.username.trim().toLowerCase();

  if (!trimmedUsername) {
    return { success: false, error: 'Username is required' };
  }
  if (!data.password.trim()) {
    return { success: false, error: 'Password is required' };
  }
  if (!data.fullName.trim()) {
    return { success: false, error: 'Full name is required' };
  }
  if (users.some(u => u.username.toLowerCase() === trimmedUsername)) {
    return { success: false, error: `Username "${trimmedUsername}" is already taken` };
  }

  const newUser: UserAccount = {
    id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    username: trimmedUsername,
    password: data.password.trim(),
    fullName: data.fullName.trim(),
    email: data.email?.trim() || `${trimmedUsername}@ilmhub.uz`,
    role: 'student',
    isActive: data.isActive,
    createdAt: new Date().toISOString(),
    level: data.level,
    progress: {
      xp: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: [],
      masteredVocab: [],
      reviewVocab: [],
      favoriteVocab: [],
      testScores: [],
      unlockedAchievements: [],
      currentLevel: data.level,
      dailyGoalXp: 50,
      todayXp: 0
    },
    notes: data.notes?.trim() || 'Created by Administrator.'
  };

  const updatedUsers = [newUser, ...users];
  saveStoredUsers(updatedUsers);
  return { success: true, user: newUser };
}

export function updateUserAccount(
  id: string,
  updates: Partial<Omit<UserAccount, 'id' | 'createdAt'>>
): { success: boolean; error?: string; user?: UserAccount } {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return { success: false, error: 'User not found' };
  }

  if (updates.username) {
    const trimmed = updates.username.trim().toLowerCase();
    if (users.some(u => u.id !== id && u.username.toLowerCase() === trimmed)) {
      return { success: false, error: 'Username is already taken by another account' };
    }
    updates.username = trimmed;
  }

  const existing = users[index];
  const updatedUser: UserAccount = {
    ...existing,
    ...updates,
    // ensure progress object isn't completely wiped if partial
    progress: updates.progress ? { ...existing.progress, ...updates.progress } : existing.progress
  };

  users[index] = updatedUser;
  saveStoredUsers(users);
  return { success: true, user: updatedUser };
}

export function deleteUserAccount(id: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const user = users.find(u => u.id === id);
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  if (user.role === 'admin' || user.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase()) {
    return { success: false, error: 'Cannot delete the primary Administrator account' };
  }

  const filtered = users.filter(u => u.id !== id);
  saveStoredUsers(filtered);
  return { success: true };
}

export function updateUserProgress(
  userId: string,
  progressUpdater: (prev: UserProgress) => UserProgress
): UserAccount | null {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  const current = users[index];
  const newProgress = progressUpdater(current.progress);
  
  // Check daily streak logic
  const today = new Date().toISOString().split('T')[0];
  if (newProgress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (newProgress.lastActiveDate === yesterday) {
      newProgress.streakDays += 1;
    } else if (newProgress.lastActiveDate < yesterday) {
      newProgress.streakDays = 1;
    }
    newProgress.lastActiveDate = today;
    newProgress.todayXp = 0;
  }

  users[index] = {
    ...current,
    lastLoginAt: new Date().toISOString(),
    progress: newProgress
  };

  saveStoredUsers(users);
  return users[index];
}

export function recordTestScore(
  userId: string,
  scoreData: Omit<TestScoreHistory, 'id' | 'date'>
): UserAccount | null {
  return updateUserProgress(userId, prev => {
    const newRecord: TestScoreHistory = {
      id: 'score-' + Date.now(),
      date: new Date().toISOString(),
      ...scoreData
    };
    const earnedXp = Math.round((scoreData.score / scoreData.totalQuestions) * 50) + 10;
    const achievements = [...prev.unlockedAchievements];
    if (!achievements.includes('ach-test-ace')) {
      achievements.push('ach-test-ace');
    }
    if (prev.xp + earnedXp >= 100 && !achievements.includes('ach-xp-100')) {
      achievements.push('ach-xp-100');
    }
    if (prev.xp + earnedXp >= 500 && !achievements.includes('ach-xp-500')) {
      achievements.push('ach-xp-500');
    }

    return {
      ...prev,
      xp: prev.xp + earnedXp,
      todayXp: prev.todayXp + earnedXp,
      testScores: [newRecord, ...prev.testScores],
      unlockedAchievements: achievements
    };
  });
}
