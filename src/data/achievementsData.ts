import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-step',
    title: 'First Step',
    uzbekTitle: 'Birinchi qadam',
    description: 'Complete your very first lesson or practice module on ILMHUB.',
    icon: 'Footprints',
    requiredLessons: 1
  },
  {
    id: 'ach-vocab-5',
    title: 'Word Collector',
    uzbekTitle: 'So‘z boyligi jamg‘aruvchi',
    description: 'Master at least 5 new vocabulary words with flashcards.',
    icon: 'Sparkles',
    requiredXp: 50
  },
  {
    id: 'ach-test-ace',
    title: 'Test Ace',
    uzbekTitle: 'Test a’lochisi',
    description: 'Complete a full examination with an accurate score.',
    icon: 'Trophy',
    requiredTests: 1
  },
  {
    id: 'ach-streak-3',
    title: 'Dedication Flame',
    uzbekTitle: 'Matonat alangasi',
    description: 'Maintain a 3-day active learning streak.',
    icon: 'Flame',
    requiredStreak: 3
  },
  {
    id: 'ach-xp-100',
    title: 'Centurion of Knowledge',
    uzbekTitle: 'Yuzlik dovon',
    description: 'Amass 100 total XP points across all skill domains.',
    icon: 'Zap',
    requiredXp: 100
  },
  {
    id: 'ach-grammar-guru',
    title: 'Grammar Master',
    uzbekTitle: 'Grammatika ustasi',
    description: 'Complete all interactive exercises in any grammar unit.',
    icon: 'BookOpen',
    requiredLessons: 3
  },
  {
    id: 'ach-streak-7',
    title: 'Weekly Champion',
    uzbekTitle: 'Haftalik chempion',
    description: 'Maintain a consistent 7-day learning streak.',
    icon: 'Award',
    requiredStreak: 7
  },
  {
    id: 'ach-xp-500',
    title: 'ILMHUB Pioneer',
    uzbekTitle: 'ILMHUB Peshqadami',
    description: 'Earn 500+ XP and reach advanced learning benchmarks.',
    icon: 'Crown',
    requiredXp: 500
  }
];
