import React, { useState, useEffect } from 'react';
import { TestQuestion, UserAccount, EnglishLevel } from '../types';
import { TEST_QUESTION_BANK } from '../data/testQuestions';
import { recordTestScore } from '../utils/storage';
import { playSuccessSound, playCelebrationSound, playErrorSound } from '../utils/speech';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Zap,
  BarChart3,
  Flag,
  AlertTriangle
} from 'lucide-react';

interface TestEngineProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onUpdateCurrentUser: (user: UserAccount) => void;
  onNavigateHome: () => void;
}

export const TestEngine: React.FC<TestEngineProps> = ({
  currentUser,
  currentLevel,
  onUpdateCurrentUser,
  onNavigateHome
}) => {
  // Test State
  const [testStage, setTestStage] = useState<'setup' | 'active' | 'results'>('setup');
  const [testSize, setTestSize] = useState<10 | 20 | 30 | 50>(10);
  const [activeQuestions, setActiveQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Timer
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(600); // 10 mins default
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isTimed, setIsTimed] = useState(true);

  // Results State
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    timeSpent: number;
  } | null>(null);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (testStage === 'active') {
      interval = setInterval(() => {
        setTimeSpentSeconds(prev => prev + 1);
        if (isTimed) {
          setTimeRemainingSeconds(prev => {
            if (prev <= 1) {
              handleSubmitTest();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [testStage, isTimed]);

  // Launch test with selected size
  const handleStartTest = (size: 10 | 20 | 30 | 50) => {
    setTestSize(size);

    // Shuffle and sample from TEST_QUESTION_BANK
    const shuffled = [...TEST_QUESTION_BANK].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, size);

    setActiveQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeSpentSeconds(0);
    setTimeRemainingSeconds(size * 60); // 1 min per question
    setTestStage('active');
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  };

  const handleSubmitTest = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    activeQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      // STRICT verification: checked strictly against q.correctIndex
      if (selected !== undefined && selected === q.correctIndex) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    });

    const total = activeQuestions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const resultData = {
      score: correctCount,
      total,
      percentage,
      correctCount,
      incorrectCount,
      timeSpent: timeSpentSeconds
    };

    setScoreResult(resultData);
    setTestStage('results');

    // Save test result into persistent user history
    const updatedUser = recordTestScore(currentUser.id, {
      testSize: total,
      score: correctCount,
      totalQuestions: total,
      percentage,
      level: currentLevel,
      timeSpentSeconds
    });

    if (updatedUser) {
      onUpdateCurrentUser(updatedUser);
    }

    if (percentage >= 70) {
      playCelebrationSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } else {
      playSuccessSound();
    }
  };

  const currentQ = activeQuestions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. TEST SETUP STAGE */}
      {testStage === 'setup' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              Standardized English Examination
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
              ILMHUB Test Engine
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              Select your examination size. Answers are evaluated with precision against real
              grammatical keys.
            </p>
          </div>

          {/* Student Candidate Info Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-zinc-900 dark:text-white">{currentUser.fullName}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Candidate @{currentUser.username}</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 font-bold">
              Level {currentUser.level}
            </span>
          </div>

          {/* Test Size Selector Cards */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Select Test Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[10, 20, 30, 50].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTestSize(size as 10 | 20 | 30 | 50)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      testSize === size
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-md shadow-blue-500/10'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl font-black">{size}</div>
                    <div className="text-xs mt-1">Questions</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">~{size} mins</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test rules highlight */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Test Guidelines:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                <li>Strict grading: only authentic correct answers are marked as correct.</li>
                <li>Questions cover Grammar, Vocabulary, Collocations, Reading, and Everyday Idioms.</li>
                <li>You can flag difficult questions and review them before final submission.</li>
                <li>Detailed answer explanations and CEFR level estimate provided upon completion.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleStartTest(testSize)}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Begin {testSize}-Question Examination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE TEST STAGE */}
      {testStage === 'active' && currentQ && (
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Top Test Control Bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <span className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                {currentQuestionIndex + 1}
              </span>
              <span>of {activeQuestions.length}</span>
            </div>

            {/* Answered progress */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Candidate: {currentUser.fullName}</span>
              <span>•</span>
              <span>{answeredCount} of {activeQuestions.length} answered</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatTime(isTimed ? timeRemainingSeconds : timeSpentSeconds)}</span>
            </div>

            {/* Flag question */}
            <button
              type="button"
              onClick={toggleFlag}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                flaggedQuestions[currentQuestionIndex]
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-600'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600'
              }`}
              title="Flag question for review"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`
              }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  {currentQ.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold">
                  {currentQ.level}
                </span>
              </div>

              {flaggedQuestions[currentQuestionIndex] && (
                <span className="text-[11px] font-semibold text-amber-500 flex items-center gap-1">
                  <Flag className="w-3 h-3 fill-amber-500" /> Flagged
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestionIndex] === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 font-semibold shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav: Previous, Palette toggle, Next, Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Examination</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Palette Map (jump to any question) */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Question Navigator ({answeredCount}/{activeQuestions.length} answered)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeQuestions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isCurrent = currentQuestionIndex === idx;
                const isFlagged = flaggedQuestions[idx];

                let bg = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
                if (isAnswered) bg = 'bg-blue-600 text-white font-bold';
                if (isFlagged) bg = 'bg-amber-500 text-white font-bold';
                if (isCurrent) bg = 'ring-2 ring-blue-500 font-extrabold';

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs transition-all ${bg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. TEST RESULTS STAGE */}
      {testStage === 'results' && scoreResult && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Results Summary Hero Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Award className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                Examination Complete!
              </h2>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                <span>Official Score Report for:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentUser.fullName}</span>
                <span className="text-zinc-400">(@{currentUser.username})</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Your answers have been graded against the authentic examination key.
              </p>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
                <div className="text-[11px] font-semibold uppercase text-zinc-400">Final Score</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  {scoreResult.score} / {scoreResult.total}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-800">
                <div className="text-[11px] font-semibold uppercase text-zinc-400">Accuracy</div>
                <div
                  className={`text-2xl sm:text-3xl font-black mt-1 ${
                    scoreResult.percentage >= 70
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-500'
                  }`}
                >
                  {scoreResult.percentage}%
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
                <div className="text-[11px] font-semibold uppercase text-emerald-700 dark:text-emerald-400">
                  Correct
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {scoreResult.correctCount}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
                <div className="text-[11px] font-semibold uppercase text-rose-700 dark:text-rose-400">
                  Incorrect
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                  {scoreResult.incorrectCount}
                </div>
              </div>
            </div>

            {/* Performance Level Assessment */}
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 max-w-lg mx-auto">
              <span className="font-bold">CEFR Assessment: </span>
              {scoreResult.percentage >= 85
                ? 'Outstanding performance! You show mastery across these grammatical and vocabulary competencies.'
                : scoreResult.percentage >= 60
                ? 'Solid understanding! Review the incorrect questions below to solidify your mastery.'
                : 'Good attempt! Re-read the explanations below and practice the flashcards to raise your score.'}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTestStage('setup')}
                className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-200 font-semibold text-xs flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Test</span>
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span>Question-by-Question Review & Explanations</span>
            </h3>

            <div className="space-y-4">
              {activeQuestions.map((q, idx) => {
                const userSelected = userAnswers[idx];
                const isCorrect = userSelected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200/80 dark:border-emerald-900/40'
                        : 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                            isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400">
                          [{q.level} • {q.category}]
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">
                      {q.question}
                    </h4>

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        <span className="font-bold block text-[10px] uppercase">
                          Your Answer:
                        </span>
                        <span>
                          {userSelected !== undefined
                            ? q.options[userSelected]
                            : '(Skipped / Not Answered)'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl border bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 text-emerald-800 dark:text-emerald-300">
                        <span className="font-bold block text-[10px] uppercase">
                          Correct Answer:
                        </span>
                        <span>{q.options[q.correctIndex]}</span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        Explanation:{' '}
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
