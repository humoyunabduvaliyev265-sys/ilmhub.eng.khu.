import React, { useState } from 'react';
import { ReadingPassage, EnglishLevel, UserAccount } from '../types';
import { READING_PASSAGES } from '../data/readingData';
import { speakEnglish, stopSpeech, playSuccessSound, playErrorSound } from '../utils/speech';
import {
  FileText,
  Clock,
  Volume2,
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpen,
  HelpCircle,
  Eye
} from 'lucide-react';

interface ReadingSectionProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onUpdateProgress: (updater: (prev: any) => any) => void;
  onChangeLevel: (level: EnglishLevel) => void;
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({
  currentUser,
  currentLevel,
  onUpdateProgress,
  onChangeLevel
}) => {
  const levelPassages = READING_PASSAGES.filter(p => p.level === currentLevel);
  const [activePassageId, setActivePassageId] = useState<string>(
    levelPassages[0]?.id || READING_PASSAGES[0].id
  );

  const activePassage =
    READING_PASSAGES.find(p => p.id === activePassageId) || levelPassages[0] || READING_PASSAGES[0];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>({});
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (checkedAnswers[qIdx]) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheckQuestion = (qIdx: number, correctIdx: number) => {
    if (selectedAnswers[qIdx] === undefined) return;
    setCheckedAnswers(prev => ({ ...prev, [qIdx]: true }));

    if (selectedAnswers[qIdx] === correctIdx) {
      playSuccessSound();
      onUpdateProgress(prev => ({
        ...prev,
        xp: prev.xp + 10,
        todayXp: prev.todayXp + 10
      }));
    } else {
      playErrorSound();
    }
  };

  const toggleReadAloud = () => {
    if (isReadingAloud) {
      stopSpeech();
      setIsReadingAloud(false);
    } else {
      setIsReadingAloud(true);
      speakEnglish(activePassage.text, 0.95, () => {
        setIsReadingAloud(false);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
              Level {currentLevel} Reading
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
              Student: {currentUser.fullName}
            </span>
            <span className="text-xs text-zinc-400">Passages & Comprehension</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Reading Comprehension
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Read engaging articles and stories, explore context words, and answer questions.
          </p>
        </div>
      </div>

      {/* Passages Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {levelPassages.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              stopSpeech();
              setIsReadingAloud(false);
              setActivePassageId(p.id);
              setSelectedAnswers({});
              setCheckedAnswers({});
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activePassage.id === p.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{p.title}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Passage & Comprehension */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Reading Passage (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {activePassage.topic || 'Reading Comprehension'}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
                  {activePassage.title}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {activePassage.readingTimeMinutes} min read
                </span>

                <button
                  type="button"
                  onClick={toggleReadAloud}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isReadingAloud
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-blue-50'
                  }`}
                  title="Read aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Passage Body Text */}
            <div className="text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {activePassage.text}
            </div>

            {/* Vocabulary Highlight Box */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Target Words in This Passage</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activePassage.vocabularyHighlights?.map((v: { word: string; uzbek: string }, i: number) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 text-xs"
                  >
                    <div className="font-bold text-zinc-900 dark:text-white flex items-center justify-between">
                      <span>{v.word}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {v.uzbek}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Comprehension Questions (1 col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Comprehension Questions</span>
            </h3>

            <div className="space-y-6">
              {activePassage.questions.map((q, qIdx) => {
                const selected = selectedAnswers[qIdx];
                const isChecked = checkedAnswers[qIdx];
                const isCorrect = selected === q.correctIndex;

                return (
                  <div
                    key={qIdx}
                    className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3 text-xs"
                  >
                    <div className="font-bold text-zinc-900 dark:text-white">
                      {qIdx + 1}. {q.question}
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        let style =
                          'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300';

                        if (isChecked) {
                          if (optIdx === q.correctIndex) {
                            style =
                              'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 font-bold';
                          } else if (selected === optIdx) {
                            style =
                              'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 line-through';
                          }
                        } else if (selected === optIdx) {
                          style =
                            'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-800 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isChecked}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={selected === undefined}
                        onClick={() => handleCheckQuestion(qIdx, q.correctIndex)}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs disabled:opacity-50 cursor-pointer"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div
                        className={`p-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Correct! +10 XP</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span>Incorrect. Correct: {q.options[q.correctIndex]}</span>
                          </>
                        )}
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
