import React, { useState, useEffect } from 'react';
import { UserAccount, EnglishLevel } from './types';
import {
  getCurrentUser,
  logoutUser,
  updateUserProgress,
  updateUserAccount,
  getStoredTheme,
  setStoredTheme,
  saveStoredUsers,
  setCurrentUserId
} from './utils/storage';
import { api, getAuthToken } from './utils/api';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';
import { Navbar, NavSection } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { LearnSection } from './components/LearnSection';
import { VocabularySection } from './components/VocabularySection';
import { GrammarSection } from './components/GrammarSection';
import { ListeningSection } from './components/ListeningSection';
import { SpeakingSection } from './components/SpeakingSection';
import { ReadingSection } from './components/ReadingSection';
import { TestEngine } from './components/TestEngine';
import { ProgressSection } from './components/ProgressSection';
import { AchievementsSection } from './components/AchievementsSection';
import { SettingsSection } from './components/SettingsSection';
import { BrandLogo } from './components/BrandLogo';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [isVerifyingSession, setIsVerifyingSession] = useState<boolean>(() => {
    return Boolean(getAuthToken());
  });

  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    const user = getCurrentUser();
    return user?.role === 'admin';
  });

  const [currentSection, setCurrentSection] = useState<NavSection>('home');
  const [currentLevel, setCurrentLevel] = useState<EnglishLevel>(() => {
    const user = getCurrentUser();
    return user?.level || 'B1';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());

  // Verify and sync active session from central database on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsVerifyingSession(false);
      return;
    }

    api
      .getMe()
      .then(res => {
        if (res.success && res.user) {
          setCurrentUser(res.user);
          setCurrentLevel(res.user.level || 'B1');
          saveStoredUsers([res.user]);
          setCurrentUserId(res.user.id);
        } else {
          // Account was deleted, disabled, or session expired on server
          logoutUser();
          setCurrentUser(null);
        }
      })
      .catch(() => {
        // Network offline fallback
      })
      .finally(() => {
        setIsVerifyingSession(false);
      });
  }, []);

  // Apply theme to HTML root & persist to storage
  useEffect(() => {
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentLevel(user.level || 'B1');
    setCurrentUserId(user.id);
    saveStoredUsers([user]);
    if (user.role === 'admin') {
      setIsAdminView(true);
    } else {
      setIsAdminView(false);
      setCurrentSection('home');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsAdminView(false);
    setCurrentSection('home');
  };

  const handleUpdateProgress = (updater: (prev: any) => any) => {
    if (!currentUser) return;
    const updated = updateUserProgress(currentUser.id, updater);
    if (updated) {
      setCurrentUser(updated);
    }
  };

  const handleUpdateCurrentUser = (user: UserAccount) => {
    setCurrentUser(user);
    saveStoredUsers([user]);
  };

  // 0. VERIFYING SESSION FROM CENTRAL DATABASE
  if (isVerifyingSession) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${
          theme === 'dark' ? 'dark' : ''
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <BrandLogo size="lg" />
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Connecting to Central Database...</span>
          </div>
        </div>
      </div>
    );
  }

  // 1. IF NOT LOGGED IN: SHOW PROFESSIONAL LOGIN SCREEN (WITH HIDDEN ADMIN GATE)
  if (!currentUser) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    );
  }

  // 2. IF ADMIN AND ADMIN VIEW IS ACTIVE: SHOW PRIVATE ADMIN PANEL
  if (currentUser.role === 'admin' && isAdminView) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <AdminPanel
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchToStudentView={() => setIsAdminView(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    );
  }

  // 3. MAIN STUDENT LEARNING PLATFORM
  return (
    <div className={`min-h-screen bg-slate-100/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Navigation Header */}
      <Navbar
        currentSection={currentSection}
        onSelectSection={sec => setCurrentSection(sec)}
        currentUser={currentUser}
        currentLevel={currentLevel}
        onChangeLevel={lvl => {
          setCurrentLevel(lvl);
          updateUserAccount(currentUser.id, { level: lvl });
        }}
        onLogout={handleLogout}
        onOpenAdminPanel={currentUser.role === 'admin' ? () => setIsAdminView(true) : undefined}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentSection === 'home' && (
          <HomeSection
            currentUser={currentUser}
            currentLevel={currentLevel}
            onNavigate={sec => setCurrentSection(sec)}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {currentSection === 'learn' && (
          <LearnSection
            currentUser={currentUser}
            currentLevel={currentLevel}
            onNavigate={sec => setCurrentSection(sec)}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {currentSection === 'vocabulary' && (
          <VocabularySection
            currentUser={currentUser}
            currentLevel={currentLevel}
            onUpdateProgress={handleUpdateProgress}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {currentSection === 'grammar' && (
          <GrammarSection
            currentUser={currentUser}
            currentLevel={currentLevel}
            onUpdateProgress={handleUpdateProgress}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {currentSection === 'listening' && (
          <ListeningSection
            currentUser={currentUser}
            currentLevel={currentLevel}
            onUpdateProgress={handleUpdateProgress}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {currentSection === 'speaking' && (
          <SpeakingSection
            currentUser={currentUser}
            currentLevel={currentLevel}
            onUpdateProgress={handleUpdateProgress}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {currentSection === 'reading' && (
          <ReadingSection
            currentUser={currentUser}
            currentLevel={currentLevel}
            onUpdateProgress={handleUpdateProgress}
            onChangeLevel={lvl => setCurrentLevel(lvl)}
          />
        )}

        {currentSection === 'tests' && (
          <TestEngine
            currentUser={currentUser}
            currentLevel={currentLevel}
            onUpdateCurrentUser={handleUpdateCurrentUser}
            onNavigateHome={() => setCurrentSection('home')}
          />
        )}

        {currentSection === 'progress' && (
          <ProgressSection
            currentUser={currentUser}
            currentLevel={currentLevel}
          />
        )}

        {currentSection === 'achievements' && (
          <AchievementsSection currentUser={currentUser} />
        )}

        {currentSection === 'settings' && (
          <SettingsSection
            currentUser={currentUser}
            onUpdateCurrentUser={handleUpdateCurrentUser}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>— Premium English Educational System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Created by / Developer: Khumoyun</span>
            <span>•</span>
            <span>CEFR Standards A1 – C2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
