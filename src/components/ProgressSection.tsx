import React from 'react';
import { UserAccount, EnglishLevel } from '../types';
import {
  TrendingUp,
  Zap,
  Flame,
  Award,
  CheckCircle2,
  BookA,
  Clock,
  BarChart2,
  Calendar
} from 'lucide-react';

interface ProgressSectionProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  currentUser,
  currentLevel
}) => {
  const p = currentUser.progress || {
    xp: 0,
    streakDays: 1,
    todayXp: 0,
    dailyGoalXp: 50,
    completedLessons: [],
    masteredVocab: [],
    reviewVocab: [],
    favoriteVocab: [],
    testScores: [],
    achievements: []
  };

  const testScores = p.testScores || [];
  const averageScore =
    testScores.length > 0
      ? Math.round(testScores.reduce((acc, t) => acc + t.percentage, 0) / testScores.length)
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
            Analytics & Growth
          </span>
          <span className="text-xs text-zinc-400">Personalized Insights</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Learning Progress
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Track your XP accumulation, study streaks, examination history, and mastered words.
        </p>
      </div>

      {/* Student Profile Overview Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                {currentUser.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                Level {currentUser.level}
              </span>
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Student ID: @{currentUser.username}</span>
              <span>•</span>
              <span>Account Status: Active Student</span>
              {currentUser.email && (
                <>
                  <span>•</span>
                  <span>{currentUser.email}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] text-zinc-400 font-semibold uppercase">Daily Goal</div>
            <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{p.todayXp} / {p.dailyGoalXp} XP</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total XP</span>
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            {p.xp}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">{p.todayXp} XP earned today</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Streak</span>
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-500">
            {p.streakDays} Days
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Daily consistency count</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Vocabulary</span>
            <BookA className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
            {p.masteredVocab?.length || 0}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Words mastered & known</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase">Avg Test Score</span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {averageScore > 0 ? `${averageScore}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Across {testScores.length} tests</div>
        </div>
      </div>

      {/* Test History Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>Standardized Test History</span>
          </h2>
          <span className="text-xs text-zinc-400">{testScores.length} Tests Recorded</span>
        </div>

        {testScores.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs">
            No tests taken yet. Visit the Tests tab to begin an assessment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {testScores.slice(-10).reverse().map((t, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 text-zinc-500 font-mono">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold text-[10px]">
                        {t.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300">
                      {t.totalQuestions} questions
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-white">
                      {t.score} / {t.totalQuestions}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-black ${
                          t.percentage >= 70
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-500'
                        }`}
                      >
                        {t.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
