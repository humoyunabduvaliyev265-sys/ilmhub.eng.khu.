import React, { useState } from 'react';
import { UserAccount, EnglishLevel } from '../types';
import { updateUserAccount } from '../utils/storage';
import {
  Settings,
  User,
  Lock,
  Target,
  Volume2,
  Moon,
  Sun,
  Check,
  Shield,
  HelpCircle
} from 'lucide-react';

interface SettingsSectionProps {
  currentUser: UserAccount;
  onUpdateCurrentUser: (user: UserAccount) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  currentUser,
  onUpdateCurrentUser,
  theme,
  onToggleTheme
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email || '');
  const [dailyGoal, setDailyGoal] = useState(currentUser.progress?.dailyGoalXp || 50);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateUserAccount(currentUser.id, {
      fullName,
      email,
      progress: {
        ...(currentUser.progress || {
          xp: 0,
          streakDays: 1,
          todayXp: 0,
          completedLessons: [],
          masteredVocab: [],
          reviewVocab: [],
          favoriteVocab: [],
          testScores: [],
          unlockedAchievements: [],
          currentLevel: currentUser.level,
          dailyGoalXp: 50
        }),
        dailyGoalXp: dailyGoal
      }
    });

    if (res.success && res.user) {
      onUpdateCurrentUser(res.user);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!newPassword.trim() || newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 4 characters' });
      return;
    }

    const res = await updateUserAccount(currentUser.id, { password: newPassword.trim() });
    if (res.success && res.user) {
      onUpdateCurrentUser(res.user);
      setPasswordMsg({ type: 'success', text: 'Password changed successfully in central database!' });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Failed to update password' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold">
            Preferences & Security
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Manage your student profile, study preferences, theme, and security credentials.
        </p>
      </div>

      {/* Profile Form Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>Profile Details</span>
        </h2>

        {profileSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                Username
              </label>
              <input
                type="text"
                disabled
                value={currentUser.username}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 font-mono text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Usernames are assigned and managed by the instructor.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="student@ilmhub.uz"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                Daily Study Goal
              </label>
              <select
                value={dailyGoal}
                onChange={e => setDailyGoal(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>Casual (30 XP / day)</option>
                <option value={50}>Regular (50 XP / day)</option>
                <option value={100}>Intensive (100 XP / day)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Save Profile Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>Security & Password</span>
        </h2>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            {passwordMsg.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Lock className="w-4 h-4 text-rose-500" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-xs font-semibold shadow-md cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

      {/* Appearance & Sound Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Interface & Theme</span>
        </h2>

        <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="font-semibold text-xs text-zinc-900 dark:text-white">
              Color Scheme Mode
            </div>
            <div className="text-[11px] text-zinc-400">
              Current mode: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </div>
          </div>

          <button
            type="button"
            id="settings-theme-toggle-btn"
            onClick={onToggleTheme}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all active:scale-95 text-zinc-800 dark:text-zinc-200"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            <span>Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
