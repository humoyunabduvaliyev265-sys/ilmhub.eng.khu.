import { UserAccount, UserProgress, EnglishLevel, TestScoreHistory } from '../types';
import { api, getAuthToken, setAuthToken, clearAuthToken } from './api';

const USERS_STORAGE_KEY = 'ilmhub_english_users_v2';
const CURRENT_USER_ID_KEY = 'ilmhub_english_current_user_id_v2';
const THEME_STORAGE_KEY = 'ilmhub_english_theme';

export const INITIAL_ADMIN_USERNAME = 'humoyun_fjx';
export const ADMIN_SECURITY_CODE = '123';
export const DEFAULT_ADMIN_PASSWORD = 'admin_fjx_secure';

const INITIAL_PROGRESS: UserProgress = {
  xp: 850,
  streakDays: 14,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: ['l-a1-1-1'],
  masteredVocab: ['v-a1-1', 'v-a1-2'],
  reviewVocab: ['v-a1-3'],
  favoriteVocab: ['v-a1-1'],
  testScores: [],
  unlockedAchievements: ['ach-first-step', 'ach-vocab-5'],
  currentLevel: 'C2',
  dailyGoalXp: 50,
  todayXp: 50
};

const INITIAL_ADMIN: UserAccount = {
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
  progress: INITIAL_PROGRESS,
  notes: 'Platform Administrator'
};

// In-memory runtime cache for seamless synchronous React renders
let runtimeUsersCache: UserAccount[] = [INITIAL_ADMIN];

export function getStoredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return [INITIAL_ADMIN];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed: UserAccount[] = JSON.parse(raw);
      // Ensure admin exists and clean up demo accounts
      const cleaned = parsed.filter(u => !['usr-student-1', 'usr-student-2', 'usr-student-3'].includes(u.id));
      if (!cleaned.some(u => u.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase())) {
        cleaned.unshift(INITIAL_ADMIN);
      }
      runtimeUsersCache = cleaned;
      return cleaned;
    }
  } catch {
    // Fall back to cache
  }
  return runtimeUsersCache;
}

export function saveStoredUsers(users: UserAccount[]): void {
  runtimeUsersCache = users;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users cache', err);
  }
}

// Background sync to fetch central users list from backend server
export async function syncUsersWithBackend(): Promise<UserAccount[]> {
  try {
    const res = await api.getAdminUsers();
    if (res.success && res.users) {
      saveStoredUsers(res.users);
      return res.users;
    }
  } catch {
    // If offline or non-admin, retain cache
  }
  return getStoredUsers();
}

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_USER_ID_KEY);
}

export function setCurrentUserId(userId: string | null): void {
  if (typeof window === 'undefined') return;
  if (userId) {
    localStorage.setItem(CURRENT_USER_ID_KEY, userId);
  } else {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  }
}

export function getCurrentUser(): UserAccount | null {
  const id = getCurrentUserId();
  if (!id) return null;
  const users = getStoredUsers();
  return users.find(u => u.id === id && u.isActive) || null;
}

export function logoutUser(): void {
  setCurrentUserId(null);
  clearAuthToken();
  api.logout().catch(() => {});
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

export async function createUserAccount(data: {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  level: EnglishLevel;
  isActive: boolean;
  notes?: string;
}): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  // Call real backend database
  const res = await api.createStudent(data);
  if (res.success && res.user) {
    const current = getStoredUsers();
    saveStoredUsers([res.user, ...current.filter(u => u.id !== res.user!.id)]);
    return { success: true, user: res.user };
  }
  return { success: false, error: res.error || 'Failed to create student in central database' };
}

export async function updateUserAccount(
  id: string,
  updates: Partial<Omit<UserAccount, 'id' | 'createdAt'>>
): Promise<{ success: boolean; error?: string; user?: UserAccount }> {
  // Optimistically update local cache
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    const existing = users[index];
    const updatedUser: UserAccount = {
      ...existing,
      ...updates,
      progress: updates.progress ? { ...existing.progress, ...updates.progress } : existing.progress
    };
    users[index] = updatedUser;
    saveStoredUsers([...users]);
  }

  // Call central backend API
  const res = await api.updateStudent(id, updates);
  if (res.success && res.user) {
    const current = getStoredUsers();
    const idx = current.findIndex(u => u.id === id);
    if (idx !== -1) {
      current[idx] = res.user;
      saveStoredUsers([...current]);
    }
    return { success: true, user: res.user };
  }
  return { success: res.success, error: res.error, user: users[index] };
}

export async function deleteUserAccount(id: string): Promise<{ success: boolean; error?: string }> {
  const users = getStoredUsers();
  const user = users.find(u => u.id === id);
  if (user && (user.role === 'admin' || user.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase())) {
    return { success: false, error: 'Cannot delete the primary Administrator account' };
  }

  // Update local cache
  saveStoredUsers(users.filter(u => u.id !== id));

  // Call central backend API
  return await api.deleteStudent(id);
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
  
  // Streak validation
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

  const updated: UserAccount = {
    ...current,
    lastLoginAt: new Date().toISOString(),
    progress: newProgress
  };

  users[index] = updated;
  saveStoredUsers([...users]);

  // Synchronize with central backend asynchronously
  api.syncProgress(userId, newProgress).catch(err => {
    console.warn('Central progress sync error:', err);
  });

  return updated;
}

export function recordTestScore(
  userId: string,
  scoreData: Omit<TestScoreHistory, 'id' | 'date'>
): UserAccount | null {
  // Call backend score recording asynchronously
  api.recordTestScore(userId, scoreData).catch(err => {
    console.warn('Central test score sync error:', err);
  });

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
