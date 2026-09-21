import React, { useState } from 'react';
import { GrammarLesson, EnglishLevel, UserAccount } from '../types';
import { GRAMMAR_LESSONS } from '../data/grammarData';
import { playSuccessSound, playErrorSound } from '../utils/speech';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Zap,
  Award
} from 'lucide-react';

interface GrammarSectionProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onUpdateProgress: (updater: (prev: any) => any) => void;
  onChangeLevel: (level: EnglishLevel) => void;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({
  currentUser,
  currentLevel,
  onUpdateProgress,
  onChangeLevel
}) => {
  const levelLessons = GRAMMAR_LESSONS.filter(l => l.level === currentLevel);
  const [activeLessonId, setActiveLessonId] = useState<string>(
    levelLessons[0]?.id || GRAMMAR_LESSONS[0].id
  );

  const activeLesson =
    GRAMMAR_LESSONS.find(l => l.id === activeLessonId) || levelLessons[0] || GRAMMAR_LESSONS[0];

  // User exercise answer selections: { [exerciseId]: selectedOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  // Submitted checks: { [exerciseId]: boolean }
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});

  const handleSelectOption = (exerciseId: string, optionIndex: number) => {
    if (checkedAnswers[exerciseId]) return; // prevent changing after check
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: optionIndex }));
  };

  const handleCheckAnswer = (exerciseId: string, correctIndex: number) => {
    const selected = selectedAnswers[exerciseId];
    if (selected === undefined) return;

    setCheckedAnswers(prev => ({ ...prev, [exerciseId]: true }));

    if (selected === correctIndex) {
      playSuccessSound();
      onUpdateProgress(prev => {
        const completed = prev.completedLessons || [];
        const updated = completed.includes(activeLesson.id)
          ? completed
          : [...completed, activeLesson.id];
        return {
          ...prev,
          xp: prev.xp + 10,
          todayXp: prev.todayXp + 10,
          completedLessons: updated
        };
      });
    } else {
      playErrorSound();
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCheckedAnswers({});
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              Level {currentLevel} Grammar
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
              Student: {currentUser.fullName}
            </span>
            <span className="text-xs text-zinc-400">Rules & Practice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Grammar Lessons
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Clear grammatical structures explained with Uzbek notes and interactive exercises.
          </p>
        </div>
      </div>

      {/* Level Topics Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {levelLessons.length === 0 ? (
          <div className="text-xs text-zinc-400">No lessons registered for this level.</div>
        ) : (
          levelLessons.map(lesson => {
            const isSelected = lesson.id === activeLesson.id;
            const isCompleted = currentUser.progress?.completedLessons?.includes(lesson.id);

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => {
                  setActiveLessonId(lesson.id);
                  handleResetQuiz();
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lesson.title}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })
        )}
      </div>

      {/* Active Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Rule & Examples (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {activeLesson.uzbekTitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {activeLesson.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                {activeLesson.summary}
              </p>
            </div>

            {/* Rules */}
            <div className="space-y-6">
              {activeLesson.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 p-5 border border-zinc-200/60 dark:border-zinc-800 space-y-3"
                >
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{rule.heading}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    {rule.explanation}
                  </p>

                  <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 font-medium">
                    <span className="font-bold">O‘zbekcha tushuntirish:</span> {rule.uzbekExplanation}
                  </div>

                  {/* Examples */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Examples:
                    </div>
                    {rule.examples.map((ex, eIdx) => (
                      <div
                        key={eIdx}
                        className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm"
                      >
                        <div className="font-semibold text-zinc-900 dark:text-white">
                          "{ex.en}"
                        </div>
                        <div className="text-zinc-500 text-xs mt-0.5">
                          O‘zbekcha: "{ex.uz}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Practice & Quiz (1 col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Practice Exercises</span>
              </div>
              <span className="text-[11px] font-semibold text-zinc-400">
                {activeLesson.exercises.length} Questions
              </span>
            </div>

            <div className="space-y-6">
              {activeLesson.exercises.map((ex, idx) => {
                const selected = selectedAnswers[ex.id];
                const isChecked = checkedAnswers[ex.id];
                const isCorrect = selected === ex.correctIndex;

                return (
                  <div
                    key={ex.id}
                    className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 space-y-3"
                  >
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {idx + 1}. {ex.question}
                    </div>

                    <div className="space-y-1.5">
                      {ex.options.map((option, optIdx) => {
                        let btnStyle =
                          'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-400';

                        if (isChecked) {
                          if (optIdx === ex.correctIndex) {
                            btnStyle =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                          } else if (selected === optIdx) {
                            btnStyle =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 line-through';
                          }
                        } else if (selected === optIdx) {
                          btnStyle =
                            'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isChecked}
                            onClick={() => handleSelectOption(ex.id, optIdx)}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs border transition-all cursor-pointer ${btnStyle}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action / Check Button */}
                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={selected === undefined}
                        onClick={() => handleCheckAnswer(ex.id, ex.correctIndex)}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Correct! +10 XP</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-500" />
                              <span>Not quite right.</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed">{ex.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
