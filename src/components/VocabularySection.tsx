import React, { useState } from 'react';
import { VocabularyWord, EnglishLevel, UserAccount } from '../types';
import { VOCABULARY_WORDS } from '../data/vocabularyData';
import { speakEnglish, playSuccessSound } from '../utils/speech';
import {
  Volume2,
  Star,
  Check,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Search,
  BookA,
  Sparkles,
  Shuffle,
  LayoutGrid,
  CreditCard
} from 'lucide-react';

interface VocabularySectionProps {
  currentUser: UserAccount;
  currentLevel: EnglishLevel;
  onUpdateProgress: (updater: (prev: any) => any) => void;
  onChangeLevel: (level: EnglishLevel) => void;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  currentUser,
  currentLevel,
  onUpdateProgress,
  onChangeLevel
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'favorites' | 'mastered' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');

  const masteredIds = currentUser.progress?.masteredVocab || [];
  const reviewIds = currentUser.progress?.reviewVocab || [];
  const favoriteIds = currentUser.progress?.favoriteVocab || [];

  // Filter words by current level and selected tab
  const levelWords = VOCABULARY_WORDS.filter(w => w.level === currentLevel);

  const filteredWords = levelWords.filter(word => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.uzbek.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'favorites') return favoriteIds.includes(word.id);
    if (filterTab === 'mastered') return masteredIds.includes(word.id);
    if (filterTab === 'review') return reviewIds.includes(word.id);
    return true;
  });

  const activeWord: VocabularyWord | undefined = filteredWords[currentIndex] || filteredWords[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % Math.max(1, filteredWords.length));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredWords.length) % Math.max(1, filteredWords.length));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    setCurrentIndex(randomIndex);
  };

  const toggleFavorite = (wordId: string) => {
    onUpdateProgress(prev => {
      const favs = prev.favoriteVocab || [];
      const updated = favs.includes(wordId)
        ? favs.filter((id: string) => id !== wordId)
        : [...favs, wordId];
      return { ...prev, favoriteVocab: updated };
    });
  };

  const markKnown = (wordId: string) => {
    playSuccessSound();
    onUpdateProgress(prev => {
      const mastered = prev.masteredVocab || [];
      const review = prev.reviewVocab || [];
      const updatedMastered = mastered.includes(wordId) ? mastered : [...mastered, wordId];
      const updatedReview = review.filter((id: string) => id !== wordId);
      return {
        ...prev,
        xp: prev.xp + 5,
        todayXp: prev.todayXp + 5,
        masteredVocab: updatedMastered,
        reviewVocab: updatedReview
      };
    });
    handleNext();
  };

  const markUnknown = (wordId: string) => {
    onUpdateProgress(prev => {
      const mastered = prev.masteredVocab || [];
      const review = prev.reviewVocab || [];
      const updatedReview = review.includes(wordId) ? review : [...review, wordId];
      const updatedMastered = mastered.filter((id: string) => id !== wordId);
      return {
        ...prev,
        masteredVocab: updatedMastered,
        reviewVocab: updatedReview
      };
    });
    handleNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
              Level {currentLevel} Vocabulary
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
              Student: {currentUser.fullName}
            </span>
            <span className="text-xs text-zinc-400">Quizlet-style Flashcards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Interactive Vocabulary
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Learn English words with Uzbek translations, IPA pronunciation, audio, and spaced practice.
          </p>
        </div>

        {/* View toggle & Level switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setViewMode('flashcard')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'flashcard'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Card</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => {
              setFilterTab('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            All Words ({levelWords.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTab('favorites');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap ${
              filterTab === 'favorites'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Saved ({levelWords.filter(w => favoriteIds.includes(w.id)).length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTab('mastered');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap ${
              filterTab === 'mastered'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>I Know It ({levelWords.filter(w => masteredIds.includes(w.id)).length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTab('review');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 whitespace-nowrap ${
              filterTab === 'review'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Review ({levelWords.filter(w => reviewIds.includes(w.id)).length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search word or Uzbek meaning..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* FLASHCARD VIEW */}
      {viewMode === 'flashcard' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {filteredWords.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
              <BookA className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No words found</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Try clearing the search or switching the filter tab.
              </p>
            </div>
          ) : activeWord ? (
            <>
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 px-2">
                <span>
                  Card {currentIndex + 1} of {filteredWords.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                    title="Shuffle cards"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px]">
                    {activeWord.category}
                  </span>
                </div>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative min-h-[320px] sm:min-h-[360px] rounded-3xl cursor-pointer select-none perspective-1000 transition-transform duration-300"
              >
                <div
                  className={`w-full h-full min-h-[320px] sm:min-h-[360px] p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col justify-between transition-all duration-300 ${
                    isFlipped
                      ? 'bg-gradient-to-br from-blue-900 to-indigo-950 text-white border-blue-800'
                      : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800 shadow-blue-500/5'
                  }`}
                >
                  {/* Card Top: Category, Star Button, Audio */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        isFlipped
                          ? 'bg-white/10 text-blue-200'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {isFlipped ? 'Uzbek Meaning & Context' : activeWord.partOfSpeech}
                    </span>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => speakEnglish(activeWord.word)}
                        className={`p-2 rounded-xl transition-colors ${
                          isFlipped
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 text-zinc-600 hover:text-blue-600'
                        }`}
                        title="Pronounce Word"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFavorite(activeWord.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          favoriteIds.includes(activeWord.id)
                            ? 'text-amber-400 bg-amber-400/10'
                            : isFlipped
                            ? 'text-white/60 hover:text-white'
                            : 'text-zinc-400 hover:text-amber-400'
                        }`}
                        title="Save to favorites"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            favoriteIds.includes(activeWord.id) ? 'fill-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Center: Word or Translation */}
                  <div className="text-center py-6 sm:py-8 space-y-3">
                    {!isFlipped ? (
                      <>
                        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                          {activeWord.word}
                        </h2>
                        <p className="text-base text-blue-600 dark:text-blue-400 font-mono">
                          {activeWord.phonetic}
                        </p>
                        <p className="text-xs text-zinc-400 pt-2">Click to reveal Uzbek meaning</p>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-blue-200">O‘zbekcha tarjimasi:</div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-amber-300">
                          {activeWord.uzbek}
                        </h2>
                        <div className="mt-4 pt-4 border-t border-white/10 text-left space-y-2">
                          <p className="text-xs sm:text-sm text-blue-100 italic">
                            "{activeWord.exampleSentence}"
                          </p>
                          <p className="text-xs text-blue-200/80">
                            Tarjimasi: "{activeWord.exampleUzbek}"
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card Bottom: Flip hint */}
                  <div className="text-center text-[11px] opacity-60">
                    {isFlipped ? 'Click card to flip back' : 'Click anywhere on card to flip'}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Prev, "I Don't Know It", "I Know It", Next */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="py-3 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => markUnknown(activeWord.id)}
                  className="py-3 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/60 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>I Don't Know It</span>
                </button>

                <button
                  type="button"
                  onClick={() => markKnown(activeWord.id)}
                  className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>I Know It (+5 XP)</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="py-3 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* GRID / LIST VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWords.map(word => {
            const isMastered = masteredIds.includes(word.id);
            const isFav = favoriteIds.includes(word.id);

            return (
              <div
                key={word.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isMastered
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-zinc-900 dark:text-white">
                        {word.word}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakEnglish(word.word)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                      {word.phonetic}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(word.id)}
                    className={`p-1 rounded ${isFav ? 'text-amber-400' : 'text-zinc-300'}`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {word.uzbek}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1 italic">
                    "{word.exampleSentence}"
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    O‘zbek: "{word.exampleUzbek}"
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {word.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => (isMastered ? markUnknown(word.id) : markKnown(word.id))}
                    className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                      isMastered
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-emerald-50'
                    }`}
                  >
                    {isMastered ? '✓ Mastered' : '+ Mark Known'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
