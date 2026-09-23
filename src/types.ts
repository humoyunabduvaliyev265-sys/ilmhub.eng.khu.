export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface UserProgress {
  xp: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedLessons: string[]; // lesson ids
  masteredVocab: string[]; // word ids
  reviewVocab: string[]; // word ids
  favoriteVocab: string[]; // word ids
  testScores: TestScoreHistory[];
  unlockedAchievements: string[];
  currentLevel: EnglishLevel;
  dailyGoalXp: number;
  todayXp: number;
}

export interface TestScoreHistory {
  id: string;
  date: string;
  testSize: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  level: EnglishLevel;
  timeSpentSeconds: number;
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  groupClass?: string;
  password?: string;
  role: 'student' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  level: EnglishLevel;
  progress: UserProgress;
  notes?: string;
}

export interface VocabularyWord {
  id: string;
  level: EnglishLevel;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  uzbek: string;
  definition: string;
  exampleSentence: string;
  exampleUzbek: string;
  category: string;
}

export interface GrammarExercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  level: EnglishLevel;
  title: string;
  uzbekTitle: string;
  summary: string;
  rules: {
    heading: string;
    explanation: string;
    uzbekExplanation: string;
    examples: { en: string; uz: string }[];
  }[];
  exercises: GrammarExercise[];
}

export interface TestQuestion {
  id: string;
  level: EnglishLevel;
  category: 'Grammar' | 'Vocabulary' | 'Reading' | 'Collocations' | 'Idioms' | 'Everyday English';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ListeningExercise {
  id: string;
  level: EnglishLevel;
  title: string;
  topic: string;
  audioText: string;
  speaker: string;
  duration?: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface SpeakingExercise {
  id: string;
  level: EnglishLevel;
  phrase: string;
  phonetic: string;
  uzbekTranslation: string;
  context: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ReadingPassage {
  id: string;
  level: EnglishLevel;
  title: string;
  topic?: string;
  readingTimeMinutes: number;
  wordCount?: number;
  text: string;
  uzbekSummary: string;
  vocabularyHighlights: { word: string; uzbek: string }[];
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface LessonQuestion {
  type: 'choice' | 'translate' | 'fill' | 'listen';
  prompt: string;
  uzbekPrompt?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface RoadmapUnit {
  id: string;
  level: EnglishLevel;
  unitNumber: number;
  title: string;
  description: string;
  lessons: RoadmapLesson[];
}

export interface RoadmapLesson {
  id: string;
  title: string;
  type: 'vocab' | 'grammar' | 'quiz' | 'dialogue';
  xpReward: number;
  questions: LessonQuestion[];
}

export interface Achievement {
  id: string;
  title: string;
  uzbekTitle: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredLessons?: number;
  requiredTests?: number;
  requiredStreak?: number;
}
