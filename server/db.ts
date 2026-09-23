import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { UserAccount, UserProgress, EnglishLevel, TestScoreHistory } from '../src/types';

export interface StoredUser extends Omit<UserAccount, 'password'> {
  passwordHash: string;
  salt: string;
  // Raw password hint ONLY for admin UI review if requested, or omitted
  tempPasswordDisplay?: string;
}

export interface SessionData {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface DatabaseSchema {
  users: StoredUser[];
  sessions: SessionData[];
  adminSecurityCode: string;
}

const DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');
const DB_TMP_FILE = path.join(DB_DIR, 'database.json.tmp');

export const INITIAL_ADMIN_USERNAME = 'humoyun_fjx';
export const DEFAULT_ADMIN_PASSWORD = 'admin_fjx_secure';
export const ADMIN_SECURITY_CODE = '123';

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

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, chosenSalt, 64).toString('hex');
  return { hash, salt: chosenSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const candidateHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

class CentralDatabase {
  private data: DatabaseSchema = {
    users: [],
    sessions: [],
    adminSecurityCode: ADMIN_SECURITY_CODE
  };
  private isLoaded = false;
  private saveQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.init();
  }

  private init(): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        // Initialize with default Administrator account
        const { hash, salt } = hashPassword(DEFAULT_ADMIN_PASSWORD);
        const adminUser: StoredUser = {
          id: 'usr-admin-1',
          username: INITIAL_ADMIN_USERNAME,
          fullName: 'Khumoyun Abduvaliyev',
          email: 'humoyunabduvaliyev265@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2026-01-15T10:00:00Z',
          lastLoginAt: new Date().toISOString(),
          level: 'C2',
          progress: INITIAL_PROGRESS,
          notes: 'Platform Administrator & Lead Instructor',
          passwordHash: hash,
          salt,
          tempPasswordDisplay: DEFAULT_ADMIN_PASSWORD
        };

        this.data = {
          users: [adminUser],
          sessions: [],
          adminSecurityCode: ADMIN_SECURITY_CODE
        };
        this.saveSync();
      }

      // Ensure Admin always exists
      const adminExists = this.data.users.some(
        u => u.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase()
      );
      if (!adminExists) {
        const { hash, salt } = hashPassword(DEFAULT_ADMIN_PASSWORD);
        this.data.users.unshift({
          id: 'usr-admin-1',
          username: INITIAL_ADMIN_USERNAME,
          fullName: 'Khumoyun Abduvaliyev',
          email: 'humoyunabduvaliyev265@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2026-01-15T10:00:00Z',
          lastLoginAt: new Date().toISOString(),
          level: 'C2',
          progress: INITIAL_PROGRESS,
          notes: 'Platform Administrator',
          passwordHash: hash,
          salt,
          tempPasswordDisplay: DEFAULT_ADMIN_PASSWORD
        });
        this.saveSync();
      }

      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to initialize CentralDatabase:', err);
    }
  }

  private saveSync(): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const serialized = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(DB_TMP_FILE, serialized, 'utf-8');
      fs.renameSync(DB_TMP_FILE, DB_FILE);
    } catch (err) {
      console.error('Error saving database synchronously:', err);
    }
  }

  private async save(): Promise<void> {
    this.saveQueue = this.saveQueue.then(async () => {
      try {
        if (!fs.existsSync(DB_DIR)) {
          await fs.promises.mkdir(DB_DIR, { recursive: true });
        }
        const serialized = JSON.stringify(this.data, null, 2);
        await fs.promises.writeFile(DB_TMP_FILE, serialized, 'utf-8');
        await fs.promises.rename(DB_TMP_FILE, DB_FILE);
      } catch (err) {
        console.error('Error saving database asynchronously:', err);
      }
    });
    return this.saveQueue;
  }

  // Sanitize user for public/client response (remove hash & salt, supply raw password to admin if requested)
  private sanitizeUser(stored: StoredUser, includePasswordForAdmin = false): UserAccount {
    return {
      id: stored.id,
      username: stored.username,
      password: includePasswordForAdmin ? (stored.tempPasswordDisplay || '••••••••') : '••••••••',
      fullName: stored.fullName,
      email: stored.email,
      role: stored.role,
      isActive: stored.isActive,
      createdAt: stored.createdAt,
      lastLoginAt: stored.lastLoginAt,
      level: stored.level,
      progress: stored.progress,
      notes: stored.notes
    };
  }

  public getAllUsers(forAdmin = false): UserAccount[] {
    return this.data.users.map(u => this.sanitizeUser(u, forAdmin));
  }

  public getUserById(id: string, forAdmin = false): UserAccount | null {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    return this.sanitizeUser(user, forAdmin);
  }

  public getUserByUsername(username: string): StoredUser | null {
    const trimmed = username.trim().toLowerCase();
    return this.data.users.find(u => u.username.toLowerCase() === trimmed) || null;
  }

  public verifyCredentials(username: string, passwordAttempt: string): { user: UserAccount | null; error?: string } {
    const stored = this.getUserByUsername(username);
    if (!stored) {
      return { user: null, error: 'Invalid username or password' };
    }

    if (!stored.isActive) {
      return { user: null, error: 'This account has been deactivated. Please contact your Administrator.' };
    }

    const isValid = verifyPassword(passwordAttempt, stored.passwordHash, stored.salt);
    if (!isValid) {
      return { user: null, error: 'Invalid username or password' };
    }

    // Update lastLoginAt
    stored.lastLoginAt = new Date().toISOString();
    this.save();

    return { user: this.sanitizeUser(stored, false) };
  }

  public verifyAdminAccess(securityCode: string, passwordAttempt: string): { user: UserAccount | null; error?: string } {
    if (securityCode.trim() !== this.data.adminSecurityCode) {
      return { user: null, error: 'Incorrect security code. Access is restricted to authorized personnel.' };
    }

    const admin = this.getUserByUsername(INITIAL_ADMIN_USERNAME);
    if (!admin) {
      return { user: null, error: 'Admin account not configured.' };
    }

    const isValid = verifyPassword(passwordAttempt, admin.passwordHash, admin.salt);
    if (!isValid) {
      return { user: null, error: 'Invalid Admin password.' };
    }

    admin.lastLoginAt = new Date().toISOString();
    this.save();

    return { user: this.sanitizeUser(admin, true) };
  }

  public async createStudent(data: {
    username: string;
    password: string;
    fullName: string;
    email?: string;
    level: EnglishLevel;
    isActive: boolean;
    notes?: string;
  }): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
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

    if (this.data.users.some(u => u.username.toLowerCase() === trimmedUsername)) {
      return { success: false, error: `Username "${trimmedUsername}" is already taken` };
    }

    const { hash, salt } = hashPassword(data.password.trim());
    const id = 'usr-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex');

    const newStudent: StoredUser = {
      id,
      username: trimmedUsername,
      passwordHash: hash,
      salt,
      tempPasswordDisplay: data.password.trim(),
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

    this.data.users.unshift(newStudent);
    await this.save();

    return { success: true, user: this.sanitizeUser(newStudent, true) };
  }

  public async updateStudent(
    id: string,
    updates: Partial<Omit<UserAccount, 'id' | 'createdAt'>>
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) {
      return { success: false, error: 'Student account not found' };
    }

    const existing = this.data.users[index];

    if (updates.username) {
      const trimmed = updates.username.trim().toLowerCase();
      if (this.data.users.some(u => u.id !== id && u.username.toLowerCase() === trimmed)) {
        return { success: false, error: 'Username is already taken by another account' };
      }
      existing.username = trimmed;
    }

    if (updates.fullName !== undefined) existing.fullName = updates.fullName.trim();
    if (updates.email !== undefined) existing.email = updates.email.trim();
    if (updates.level !== undefined) existing.level = updates.level;
    if (updates.notes !== undefined) existing.notes = updates.notes;
    
    // Check if isActive status changed
    if (updates.isActive !== undefined) {
      existing.isActive = updates.isActive;
      // If student is disabled, revoke all their active sessions across all devices
      if (!updates.isActive) {
        this.data.sessions = this.data.sessions.filter(s => s.userId !== id);
      }
    }

    if (updates.progress) {
      existing.progress = { ...existing.progress, ...updates.progress };
    }

    await this.save();
    return { success: true, user: this.sanitizeUser(existing, true) };
  }

  public async resetStudentPassword(
    id: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    const user = this.data.users.find(u => u.id === id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long' };
    }

    const { hash, salt } = hashPassword(newPassword.trim());
    user.passwordHash = hash;
    user.salt = salt;
    user.tempPasswordDisplay = newPassword.trim();

    // Revoke old sessions so user must log in with new password
    this.data.sessions = this.data.sessions.filter(s => s.userId !== id);

    await this.save();
    return { success: true };
  }

  public async deleteStudent(id: string): Promise<{ success: boolean; error?: string }> {
    const user = this.data.users.find(u => u.id === id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    if (user.role === 'admin' || user.username.toLowerCase() === INITIAL_ADMIN_USERNAME.toLowerCase()) {
      return { success: false, error: 'Cannot delete the platform Administrator account' };
    }

    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.sessions = this.data.sessions.filter(s => s.userId !== id);

    await this.save();
    return { success: true };
  }

  public async updateProgress(
    userId: string,
    newProgress: UserProgress
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Daily streak validation
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

    user.progress = newProgress;
    user.lastLoginAt = new Date().toISOString();

    await this.save();
    return { success: true, user: this.sanitizeUser(user, false) };
  }

  public async recordTestScore(
    userId: string,
    scoreData: Omit<TestScoreHistory, 'id' | 'date'>
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const prev = user.progress;
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

    user.progress = {
      ...prev,
      xp: prev.xp + earnedXp,
      todayXp: prev.todayXp + earnedXp,
      testScores: [newRecord, ...prev.testScores],
      unlockedAchievements: achievements
    };

    await this.save();
    return { success: true, user: this.sanitizeUser(user, false) };
  }

  // Session Token Management
  public async createSession(userId: string): Promise<string> {
    const token = 'ilm_' + crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days session

    this.data.sessions.push({
      token,
      userId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    });

    await this.save();
    return token;
  }

  public validateSession(token: string): UserAccount | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      // Session expired
      this.data.sessions = this.data.sessions.filter(s => s.token !== token);
      this.save();
      return null;
    }

    const user = this.data.users.find(u => u.id === session.userId);
    if (!user || !user.isActive) {
      return null;
    }

    return this.sanitizeUser(user, user.role === 'admin');
  }

  public async destroySession(token: string): Promise<void> {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    await this.save();
  }
}

export const db = new CentralDatabase();
