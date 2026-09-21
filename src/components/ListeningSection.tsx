import React, { useState } from 'react';
import { ListeningExercise, EnglishLevel, UserAccount } from '../types';
import { LISTENING_EXERCISES } from '../data/listeningData';
import { speakEnglish, stopSpeech, isSpeechPlaying, playSuccessSound, playErrorSound } from '../utils/speech';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Gauge,
  HelpCircle
} from 'lucide-react';

interface ListeningSectionProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onUpdateProgress: (updater: (prev: any) => any) => void;
  onChangeLevel: (level: EnglishLevel) => void;
}

export const ListeningSection: React.FC<ListeningSectionProps> = ({
  currentUser,
  currentLevel,
  onUpdateProgress,
  onChangeLevel
}) => {
  const levelExercises = LISTENING_EXERCISES.filter(e => e.level === currentLevel);
  const [activeExerciseId, setActiveExerciseId] = useState<string>(
    levelExercises[0]?.id || LISTENING_EXERCISES[0].id
  );

  const activeExercise =
    LISTENING_EXERCISES.find(e => e.id === activeExerciseId) ||
    levelExercises[0] ||
    LISTENING_EXERCISES[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<0.75 | 1.0 | 1.25>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Question answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<number, boolean>>({});

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakEnglish(activeExercise.audioText, playbackRate, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleReplay = () => {
    stopSpeech();
    setIsPlaying(true);
    speakEnglish(activeExercise.audioText, playbackRate, () => {
      setIsPlaying(false);
    });
  };

  const handleSpeedChange = (speed: 0.75 | 1.0 | 1.25) => {
    setPlaybackRate(speed);
    if (isPlaying) {
      stopSpeech();
      speakEnglish(activeExercise.audioText, speed, () => {
        setIsPlaying(false);
      });
    }
  };

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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
              Level {currentLevel} Listening
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
              Student: {currentUser.fullName}
            </span>
            <span className="text-xs text-zinc-400">Audio Comprehension</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Listening Practice
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Listen to native speech patterns, control playback speed, and test comprehension.
          </p>
        </div>
      </div>

      {/* Topics Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {levelExercises.map(ex => (
          <button
            key={ex.id}
            type="button"
            onClick={() => {
              stopSpeech();
              setIsPlaying(false);
              setActiveExerciseId(ex.id);
              setSelectedAnswers({});
              setCheckedAnswers({});
              setShowTranscript(false);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeExercise.id === ex.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>{ex.title}</span>
          </button>
        ))}
      </div>

      {/* Main Player & Comprehension Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Audio Player Card (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Topic: {activeExercise.topic}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
                  {activeExercise.title}
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold self-start sm:self-auto">
                {activeExercise.duration || '1-2 min'}
              </span>
            </div>

            {/* Simulated Audio Waveform & Big Play Button */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 text-center space-y-6">
              <div className="flex items-center justify-center gap-1.5 h-16">
                {[40, 65, 30, 80, 50, 95, 70, 45, 90, 60, 75, 40, 85, 30, 90, 50, 70].map(
                  (h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-zinc-300 dark:bg-zinc-700'
                      }`}
                      style={{ height: `${isPlaying ? h : 20}%` }}
                    />
                  )
                )}
              </div>

              {/* Player Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Replay */}
                <button
                  type="button"
                  onClick={handleReplay}
                  className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition-colors shadow-sm"
                  title="Replay Audio"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {/* Primary Play / Pause Button */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-16 h-16 rounded-3xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-xl shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white ml-1" />
                  )}
                </button>

                {/* Speed Controls (0.75x, 1x, 1.25x) */}
                <div className="flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  {([0.75, 1.0, 1.25] as const).map(rate => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        playbackRate === rate
                          ? 'bg-white dark:bg-zinc-900 text-amber-600 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-400">
                {isPlaying
                  ? 'Listening in progress... (Natural pronunciation synthesizer)'
                  : 'Click play to start audio playback.'}
              </p>
            </div>

            {/* Transcript Reveal Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <FileText className="w-4 h-4" />
                <span>{showTranscript ? 'Hide Audio Transcript' : 'Show Audio Transcript'}</span>
              </button>

              {showTranscript && (
                <div className="mt-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed animate-in fade-in">
                  <div className="font-bold text-zinc-900 dark:text-white mb-1">
                    Transcript:
                  </div>
                  {activeExercise.audioText}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Comprehension Questions (1 col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Comprehension Check</span>
            </h3>

            <div className="space-y-6">
              {activeExercise.questions.map((q, qIdx) => {
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
                            'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 font-bold';
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
                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs disabled:opacity-50 cursor-pointer"
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
