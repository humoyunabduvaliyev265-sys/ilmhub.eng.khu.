import React from 'react';
import { UserAccount, EnglishLevel } from '../types';
import { NavSection } from './Navbar';
import { speakEnglish } from '../utils/speech';
import { VOCABULARY_WORDS } from '../data/vocabularyData';
import {
  Flame,
  Zap,
  ArrowRight,
  BookA,
  BookOpen,
  Headphones,
  CheckSquare,
  Volume2,
  Trophy,
  Target,
  Sparkles,
  Play
} from 'lucide-react';

interface HomeSectionProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onNavigate: (section: NavSection) => void;
  onChangeLevel: (level: EnglishLevel) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  currentUser,
  currentLevel,
  onNavigate,
  onChangeLevel
}) => {
  // Find a word of the day matching current level or general
  const levelWords = VOCABULARY_WORDS.filter(w => w.level === currentLevel);
  const wordOfDay = levelWords[0] || VOCABULARY_WORDS[0];

  const dailyGoal = currentUser.progress?.dailyGoalXp || 50;
  const todayXp = currentUser.progress?.todayXp || 0;
  const progressPercent = Math.min(100, Math.round((todayXp / dailyGoal) * 100));

  const levelTitles: Record<EnglishLevel, string> = {
    A1: 'Beginner Foundations',
    A2: 'Elementary English',
    B1: 'Intermediate Mastery',
    B2: 'Upper-Intermediate Fluency',
    C1: 'Advanced Communication',
    C2: 'Proficiency & Nuance'
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 sm:p-8 shadow-xl shadow-blue-600/15">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ILMHUB ENGLISH • Student Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Assalomu alaykum, {currentUser.fullName}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
            Ready to upgrade your English today? You are currently practicing at{' '}
            <strong className="text-white font-bold">{currentLevel} ({levelTitles[currentLevel]})</strong>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-blue-700" />
              <span>Continue Learning Path</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('tests')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm border border-white/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Take Level Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Goal & Streak Progress Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Goal Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm">
              <Target className="w-4 h-4 text-blue-500" />
              <span>Daily Goal</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {todayXp} / {dailyGoal} XP
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">
            {progressPercent >= 100
              ? '🎉 Daily goal completed! Keep going for bonus XP.'
              : `${dailyGoal - todayXp} more XP needed to reach today’s goal.`}
          </p>
        </div>

        {/* Streak Flame Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-zinc-400">Consistency</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-500">
              {currentUser.progress?.streakDays || 1}
            </span>
            <span className="text-xs text-zinc-500 font-semibold">Day Streak</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Study every day to keep your learning momentum active!
          </p>
        </div>

        {/* Level Selector Quick Switch */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-zinc-400">Current CEFR Level</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {currentLevel}
            </span>
            <span className="text-xs text-zinc-500 font-semibold truncate">
              {levelTitles[currentLevel]}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as EnglishLevel[]).map(l => (
              <button
                key={l}
                type="button"
                onClick={() => onChangeLevel(l)}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                  currentLevel === l
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Word of the Day Card */}
      {wordOfDay && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Word of the Day ({currentLevel})
                </span>
                <span className="text-xs text-zinc-500 font-mono">{wordOfDay.phonetic}</span>
              </div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {wordOfDay.word}
                </h3>
                <span className="text-base font-semibold text-blue-600 dark:text-blue-400">
                  — {wordOfDay.uzbek}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic">
                "{wordOfDay.exampleSentence}"
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                O‘zbekcha: "{wordOfDay.exampleUzbek}"
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => speakEnglish(`${wordOfDay.word}. ${wordOfDay.exampleSentence}`)}
                className="p-3 rounded-xl bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-50 transition-colors shadow-sm"
                title="Listen to pronunciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('vocabulary')}
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <span>Open Flashcards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Modules Grid */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">
          Explore Learning Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('vocabulary')}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookA className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
              Vocabulary Flashcards
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Quizlet-style interactive cards with Uzbek translations, IPA, and audio.
            </p>
          </div>

          <div
            onClick={() => onNavigate('grammar')}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
              Grammar Lessons
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Rules organized by level with examples and instant exercise checks.
            </p>
          </div>

          <div
            onClick={() => onNavigate('tests')}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
              Test Engine
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select 10, 20, 30, or 50 questions with rigorous answer scoring.
            </p>
          </div>

          <div
            onClick={() => onNavigate('listening')}
            className="group p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
              Listening Practice
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Natural speech synthesis with speed control and comprehension quizzes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
