import React, { useState } from 'react';
import { EnglishLevel, UserAccount, RoadmapLesson, LessonQuestion } from '../types';
import { LEARNING_ROADMAP } from '../data/learningRoadmap';
import { NavSection } from './Navbar';
import { playSuccessSound, playCelebrationSound, playErrorSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  BookOpen,
  Headphones,
  FileText,
  Star,
  Zap,
  X,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface LearnSectionProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onNavigate: (section: NavSection) => void;
  onChangeLevel: (level: EnglishLevel) => void;
}

export const LearnSection: React.FC<LearnSectionProps> = ({
  currentUser,
  currentLevel,
  onNavigate,
  onChangeLevel
}) => {
  const unitsForLevel = LEARNING_ROADMAP.filter(u => u.level === currentLevel);
  const currentUnit = unitsForLevel[0] || LEARNING_ROADMAP[0];

  const completedLessonIds = currentUser.progress?.completedLessons || [];

  // Active interactive lesson modal
  const [activeLesson, setActiveLesson] = useState<RoadmapLesson | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'vocab':
        return <Star className="w-5 h-5" />;
      case 'grammar':
        return <BookOpen className="w-5 h-5" />;
      case 'listening':
        return <Headphones className="w-5 h-5" />;
      case 'reading':
        return <FileText className="w-5 h-5" />;
      case 'quiz':
      case 'dialogue':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const handleOpenLesson = (lesson: RoadmapLesson) => {
    setActiveLesson(lesson);
    setQIndex(0);
    setSelectedOpt(null);
    setIsChecked(false);
    setLessonFinished(false);
  };

  const currentQ: LessonQuestion | undefined = activeLesson?.questions[qIndex];

  const handleCheckAnswer = () => {
    if (selectedOpt === null || !currentQ) return;
    setIsChecked(true);

    if (selectedOpt === currentQ.correctAnswer) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const handleNextQuestion = () => {
    if (!activeLesson) return;
    if (qIndex < activeLesson.questions.length - 1) {
      setQIndex(prev => prev + 1);
      setSelectedOpt(null);
      setIsChecked(false);
    } else {
      setLessonFinished(true);
      playCelebrationSound();
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {
        // Confetti fallback
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Unit Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Level {currentLevel} • Unit {currentUnit.unitNumber}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-medium backdrop-blur-sm">
                Student: {currentUser.fullName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{currentUnit.title}</h1>
            <p className="text-xs sm:text-sm text-blue-100">{currentUnit.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('tests')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Take Level Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepped Learning Path */}
      <div className="max-w-xl mx-auto py-8">
        <div className="relative flex flex-col items-center space-y-8">
          {/* Connector line */}
          <div className="absolute top-8 bottom-8 w-1.5 bg-zinc-200 dark:bg-zinc-800 -z-0 rounded-full" />

          {currentUnit.lessons.map((lesson, index) => {
            const isCompleted = completedLessonIds.includes(lesson.id) || index === 0;
            const offsets = [
              'translate-x-0',
              'translate-x-8',
              '-translate-x-8',
              'translate-x-6',
              '-translate-x-6'
            ];
            const offsetClass = offsets[index % offsets.length];

            return (
              <div
                key={lesson.id}
                className={`relative z-10 flex flex-col items-center ${offsetClass} transition-transform`}
              >
                {/* Node circle button */}
                <button
                  type="button"
                  onClick={() => handleOpenLesson(lesson)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all cursor-pointer group shadow-lg active:scale-95 ${
                    isCompleted
                      ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-950'
                      : 'bg-white dark:bg-zinc-800 text-zinc-400 border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-400'
                  }`}
                  title={`${lesson.title} - ${lesson.xpReward} XP`}
                >
                  {isCompleted ? getNodeIcon(lesson.type) : <Lock className="w-5 h-5" />}
                </button>

                {/* Label */}
                <div className="mt-2 text-center max-w-[150px]">
                  <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 truncate">
                    {lesson.title}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-amber-500">
                    <Zap className="w-3 h-3 fill-amber-500" />
                    <span>+{lesson.xpReward} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE LESSON MODAL */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveLesson(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {!lessonFinished && currentQ ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {activeLesson.title}
                  </span>
                  <span>
                    Question {qIndex + 1} of {activeLesson.questions.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{
                      width: `${((qIndex + 1) / activeLesson.questions.length) * 100}%`
                    }}
                  />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
                  {currentQ.prompt}
                </h3>

                {/* Options */}
                <div className="space-y-2">
                  {currentQ.options?.map((opt: string, idx: number) => {
                    const isSelected = selectedOpt === idx;
                    let style =
                      'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-blue-400';

                    if (isChecked) {
                      if (idx === currentQ.correctAnswer) {
                        style =
                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                      } else if (isSelected) {
                        style =
                          'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 line-through';
                      }
                    } else if (isSelected) {
                      style =
                        'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-800 dark:text-blue-300 font-semibold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isChecked}
                        onClick={() => setSelectedOpt(idx)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Action button */}
                {!isChecked ? (
                  <button
                    type="button"
                    disabled={selectedOpt === null}
                    onClick={handleCheckAnswer}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-40 cursor-pointer shadow-md shadow-blue-500/20"
                  >
                    Check
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-xl text-xs ${
                        selectedOpt === currentQ.correctAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      <div className="font-bold">
                        {selectedOpt === currentQ.correctAnswer
                          ? '✓ Correct!'
                          : '✕ Not quite right.'}
                      </div>
                      <p className="text-[11px] mt-0.5">{currentQ.explanation}</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  🎉
                </div>
                <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                  Lesson Completed!
                </h3>
                <p className="text-xs text-zinc-500">
                  You finished "{activeLesson.title}" and earned +{activeLesson.xpReward} XP!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveLesson(null)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Back to Path
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
