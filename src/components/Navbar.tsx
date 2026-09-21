import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EnglishLevel, UserAccount } from '../types';
import {
  Home,
  GraduationCap,
  BookA,
  BookOpen,
  Headphones,
  Mic,
  FileText,
  CheckSquare,
  TrendingUp,
  Award,
  Settings,
  Flame,
  Zap,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

export type NavSection =
  | 'home'
  | 'learn'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'tests'
  | 'progress'
  | 'achievements'
  | 'settings';

interface NavbarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onChangeLevel: (level: EnglishLevel) => void;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  currentUser,
  currentLevel,
  onChangeLevel,
  onLogout,
  onOpenAdminPanel,
  theme,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'vocabulary', label: 'Vocabulary', icon: <BookA className="w-4 h-4" /> },
    { id: 'grammar', label: 'Grammar', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'listening', label: 'Listening', icon: <Headphones className="w-4 h-4" /> },
    { id: 'speaking', label: 'Speaking', icon: <Mic className="w-4 h-4" /> },
    { id: 'reading', label: 'Reading', icon: <FileText className="w-4 h-4" /> },
    { id: 'tests', label: 'Tests', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const levels: EnglishLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      {/* Upper Bar: Brand, Stats, Level Selector, Profile */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
        </div>

        {/* Center: CEFR Level Selector Pill Bar */}
        <div className="hidden lg:flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60">
          {levels.map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChangeLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLevel === lvl
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Right: Gamified Stats, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Level Select Dropdown */}
          <div className="lg:hidden flex items-center">
            <select
              value={currentLevel}
              onChange={e => onChangeLevel(e.target.value as EnglishLevel)}
              className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-900"
            >
              {levels.map(l => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Streak badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 text-xs font-bold"
            title="Daily Active Streak"
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{currentUser.progress?.streakDays || 1}</span>
          </div>

          {/* XP badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-600 dark:text-amber-400 text-xs font-bold"
            title="Total XP Earned"
          >
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{currentUser.progress?.xp || 0} XP</span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            id="navbar-theme-toggle"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
                {currentUser.fullName.slice(0, 2)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    @{currentUser.username}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      {currentLevel} Level
                    </span>
                    {currentUser.role === 'admin' && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                        ADMIN
                      </span>
                    )}
                  </div>
                </div>

                {/* If Admin, allow quick return to Admin Panel */}
                {currentUser.role === 'admin' && onOpenAdminPanel && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAdminPanel();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 font-semibold"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onSelectSection('settings');
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Account Settings</span>
                </button>

                <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Secondary Navigation Ribbon (All 11 Modules) */}
      <div className="hidden md:block border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
            {navItems.map(item => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2 animate-in slide-in-from-top-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Theme Mode</span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold flex items-center gap-2 text-zinc-700 dark:text-zinc-200"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-600" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
