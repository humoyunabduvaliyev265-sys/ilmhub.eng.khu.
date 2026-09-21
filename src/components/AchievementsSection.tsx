import React from 'react';
import { UserAccount, Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/achievementsData';
import {
  Award,
  Lock,
  Sparkles,
  CheckCircle2,
  Zap,
  Flame,
  Trophy,
  Footprints,
  BookOpen,
  Crown
} from 'lucide-react';

interface AchievementsSectionProps {
  currentUser: UserAccount;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ currentUser }) => {
  const p = currentUser.progress || {
    xp: 0,
    streakDays: 1,
    completedLessons: [],
    masteredVocab: [],
    testScores: [],
    unlockedAchievements: []
  };

  const unlocked = p.unlockedAchievements || [];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-7 h-7 text-amber-500" />;
      case 'Sparkles':
        return <Sparkles className="w-7 h-7 text-indigo-500" />;
      case 'Trophy':
        return <Trophy className="w-7 h-7 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-7 h-7 text-orange-500 fill-orange-500" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-yellow-500 fill-yellow-500" />;
      case 'BookOpen':
        return <BookOpen className="w-7 h-7 text-blue-500" />;
      case 'Crown':
        return <Crown className="w-7 h-7 text-amber-500" />;
      default:
        return <Award className="w-7 h-7 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
            Milestones & Badges
          </span>
          <span className="text-xs text-zinc-400">Gamified Rewards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Achievements
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Earn exclusive badges and milestones by studying daily, taking tests, and building vocabulary.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map(badge => {
          let isUnlocked = unlocked.includes(badge.id);

          // Dynamic qualification checks
          if (badge.requiredLessons && (p.completedLessons?.length || 0) >= badge.requiredLessons) {
            isUnlocked = true;
          }
          if (badge.requiredXp && (p.xp || 0) >= badge.requiredXp) {
            isUnlocked = true;
          }
          if (badge.requiredStreak && (p.streakDays || 1) >= badge.requiredStreak) {
            isUnlocked = true;
          }
          if (badge.requiredTests && (p.testScores?.length || 0) >= badge.requiredTests) {
            isUnlocked = true;
          }

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-white dark:to-zinc-900 border-amber-300 dark:border-amber-900/60 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800">
                  {getIconComponent(badge.icon)}
                </div>
                {isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">
                  {badge.title}
                </h3>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  {badge.uzbekTitle}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
                {badge.requiredXp && <span>Goal: {badge.requiredXp} Total XP</span>}
                {badge.requiredStreak && <span>Goal: {badge.requiredStreak}-Day Streak</span>}
                {badge.requiredLessons && <span>Goal: Complete {badge.requiredLessons} Lessons</span>}
                {badge.requiredTests && <span>Goal: Complete {badge.requiredTests} Test</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
