import { ReadingPassage } from '../types';

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'rd-1',
    level: 'A1',
    title: 'A Day at the ILMHUB Study Lounge',
    readingTimeMinutes: 2,
    uzbekSummary: 'ILMHUB o‘quv markazidagi oddiy va sermahsul kun haqida qisqa hikoya.',
    text: `Every morning at 8:00 AM, the ILMHUB study center opens its doors. The instructor welcomes students with a bright smile. On the whiteboards, he writes five new English words with their Uzbek translations. 
    
    The students open their notebooks, read the examples aloud, and practice short dialogues with partners. In the afternoon, they complete quizzes on their tablets to earn XP and build their streaks. By the end of the day, every student has practiced reading, speaking, and listening. They leave motivated, eager for tomorrow's challenge.`,
    vocabularyHighlights: [
      { word: 'Welcomes', uzbek: 'Kutib oladi' },
      { word: 'Bright smile', uzbek: 'Keng tabassum' },
      { word: 'Motivated', uzbek: 'Ilhomlangan, g‘ayratli' },
      { word: 'Eager', uzbek: 'Ishtiyoqmand' }
    ],
    questions: [
      {
        id: 'rq-1-1',
        question: 'At what time does the ILMHUB study center open in the morning?',
        options: ['7:00 AM', '8:00 AM', '9:30 AM', '10:00 AM'],
        correctIndex: 1,
        explanation: 'The passage explicitly says: "Every morning at 8:00 AM, the ILMHUB study center opens its doors."'
      },
      {
        id: 'rq-1-2',
        question: 'What do students do on their tablets in the afternoon?',
        options: ['Watch movies', 'Complete quizzes to earn XP', 'Play video games', 'Send emails'],
        correctIndex: 1,
        explanation: 'The text states: "they complete quizzes on their tablets to earn XP and build their streaks."'
      }
    ]
  },
  {
    id: 'rd-2',
    level: 'A2',
    title: 'The Power of the 15-Minute Rule',
    readingTimeMinutes: 3,
    uzbekSummary: 'Til o‘rganishda 15 daqiqalik qoidaning nechog‘li muhimligi haqida tavsiyaviy maqola.',
    text: `Many language learners believe they must study for three uninterrupted hours on the weekend to make noticeable progress. Educational psychologists, however, disagree. Brain imaging shows that the human mind retains vocabulary far more efficiently through short, spaced daily sessions.
    
    Dedication to just fifteen focused minutes every morning builds strong neural pathways. In fifteen minutes, you can review twenty flashcards, listen to a native dialogue twice, and repeat three full sentences. Over one year, those fifteen daily minutes compound into more than ninety hours of active English practice!`,
    vocabularyHighlights: [
      { word: 'Uninterrupted', uzbek: 'Uzluksiz, to‘xtovsiz' },
      { word: 'Noticeable', uzbek: 'Sezilarli' },
      { word: 'Retains', uzbek: 'Eslab qoladi, saqlaydi' },
      { word: 'Compound', uzbek: 'Ko‘payib boradi, jamlanadi' }
    ],
    questions: [
      {
        id: 'rq-2-1',
        question: 'Why are short daily sessions better than long weekend sessions?',
        options: [
          'They are cheaper',
          'The brain retains vocabulary more efficiently through spaced learning',
          'They require no notebooks',
          'Teachers prefer shorter classes'
        ],
        correctIndex: 1,
        explanation: 'The passage explains that "the human mind retains vocabulary far more efficiently through short, spaced daily sessions."'
      }
    ]
  },
  {
    id: 'rd-3',
    level: 'B1',
    title: 'Silk Road: The Bridge of Cultures and Commerce',
    readingTimeMinutes: 4,
    uzbekSummary: 'Buyuk Ipak Yo‘li va uning madaniyatlar, savdo hamda tillar almashinuvidagi beqiyos o‘rni.',
    text: `For centuries, the ancient Silk Road served as an artery connecting Central Asia to the Mediterranean and the Far East. Cities such as Samarkand and Bukhara flourished as intellectual hubs where scholars, astronomers, and traders exchanged mathematical treatises alongside exotic spices and silk.
    
    Language was the indispensable currency of this international commerce. Merchants mastered multilingual communication out of practical necessity. Today, learning global languages like English continues this proud Central Asian tradition of cross-cultural dialogue and academic excellence.`,
    vocabularyHighlights: [
      { word: 'Artery', uzbek: 'Asosiy yo‘l, tomir' },
      { word: 'Flourished', uzbek: 'Gullab-yashnadi' },
      { word: 'Indispensable', uzbek: 'Juda zarur, ajralmas' },
      { word: 'Currency', uzbek: 'Valyuta, vosita' }
    ],
    questions: [
      {
        id: 'rq-3-1',
        question: 'According to the passage, why did ancient merchants master multilingual communication?',
        options: [
          'To pass university exams',
          'Out of practical necessity for trade and dialogue',
          'Because they were forced by kings',
          'To write poetry only'
        ],
        correctIndex: 1,
        explanation: 'The text notes: "Merchants mastered multilingual communication out of practical necessity."'
      }
    ]
  },
  {
    id: 'rd-4',
    level: 'B2',
    title: 'Cognitive Advantages of Bilingualism',
    readingTimeMinutes: 4,
    uzbekSummary: 'Ikki yoki undan ortiq tilni bilish inson miyasi va fikrlash qobiliyatiga qanday foyda berishi haqida ilmiy sharh.',
    text: `Operating fluidly in multiple linguistic frameworks exercises executive control in the human prefrontal cortex. Bilingual individuals habitually manage competing phonetic systems and lexical databases, suppressing interference from one tongue while articulating thoughts in another.
    
    Research demonstrates that this continuous mental juggling enhances task-switching flexibility, strengthens working memory, and significantly delays cognitive decline in later stages of adulthood. Fluency is not merely an ornament of international travel; it is an enduring neurological shield.`,
    vocabularyHighlights: [
      { word: 'Executive control', uzbek: 'Boshqaruvchanlik nazorati' },
      { word: 'Suppressing', uzbek: 'Bosish, jilovlash' },
      { word: 'Juggling', uzbek: 'Bir paytda bir nechta ishni uddalash' },
      { word: 'Enduring', uzbek: 'Bardavom, mustahkam' }
    ],
    questions: [
      {
        id: 'rq-4-1',
        question: 'What neurological benefit does bilingualism provide in later adulthood according to research?',
        options: [
          'Better eyesight',
          'Delays cognitive decline',
          'Faster physical running speed',
          'Eliminates need for sleep'
        ],
        correctIndex: 1,
        explanation: 'Research demonstrates that bilingualism "significantly delays cognitive decline in later stages of adulthood."'
      }
    ]
  },
  {
    id: 'rd-5',
    level: 'C1',
    title: 'The Architecture of Persuasive Rhetoric',
    readingTimeMinutes: 5,
    uzbekSummary: 'Nutq san’ati, ta’sirchan notiqlik tuzilishi va ritorika qonuniyatlari.',
    text: `Aristotelian rhetoric categorizes persuasion into three interdependent pillars: Ethos, Pathos, and Logos. Ethos establishes the orator’s authority and moral credibility; Pathos awakens empathetic resonance within the audience’s sensibility; Logos underpins the argument with rigorous deductive coherence.
    
    A sophisticated modern orator weaving an argument at C1 or C2 level calibrates these facets with immaculate restraint. Over-reliance on emotional appeal produces sensationalist bluster, whereas purely sterile syllogisms alienate listeners. The master of English harmonizes passion with irrefutable dialectic clarity.`,
    vocabularyHighlights: [
      { word: 'Interdependent', uzbek: 'Bir-biriga bog‘liq' },
      { word: 'Resonance', uzbek: 'Aks sado, hamdardlik' },
      { word: 'Immaculate', uzbek: 'Benuqson, toza' },
      { word: 'Irrefutable', uzbek: 'Inkor etib bo‘lmas' }
    ],
    questions: [
      {
        id: 'rq-5-1',
        question: 'What is the danger of relying exclusively on emotional appeal (Pathos)?',
        options: [
          'It creates sensationalist bluster',
          'It makes speeches too long',
          'It improves logical reasoning',
          'It confuses pronunciation'
        ],
        correctIndex: 0,
        explanation: 'The passage warns that "Over-reliance on emotional appeal produces sensationalist bluster."'
      }
    ]
  },
  {
    id: 'rd-6',
    level: 'C2',
    title: 'Hermeneutics and the Fluidity of Meaning',
    readingTimeMinutes: 6,
    uzbekSummary: 'Matn talqini (germenevtika), kontekstual ma’no va tilning ko‘p ma’noliligi haqida falsafiy insho.',
    text: `Hermeneutic philosophy posits that semantic comprehension is never an inert extraction of encoded data; it is an interpretive encounter between the reader’s historical horizon and the textual artifact. Every lexicon carries subtle historical sediments and socio-cultural resonances that resist mechanical transliteration.
    
    At the pinnacle of language mastery, the learner ceases to regard a foreign tongue as a mere cipher for native idioms. Instead, English becomes an alternative perceptual vantage point—an autonomous semantic realm through which reality is re-imagined with poetic precision.`,
    vocabularyHighlights: [
      { word: 'Hermeneutic', uzbek: 'Germenevtik, talqinga oid' },
      { word: 'Transliteration', uzbek: 'So‘zma-so‘z tarjima' },
      { word: 'Pinnacle', uzbek: 'Cho‘qqi, eng yuqori daraja' },
      { word: 'Vantage point', uzbek: 'Kuzatuv nuqtasi, qulay burchak' }
    ],
    questions: [
      {
        id: 'rq-6-1',
        question: 'How does the passage describe semantic comprehension at the highest level of mastery?',
        options: [
          'A mechanical translation of dictionary words',
          'An interpretive encounter and autonomous perceptual vantage point',
          'Memorization of 10,000 grammar rules',
          'Ignoring historical context'
        ],
        correctIndex: 1,
        explanation: 'The text describes it as an "interpretive encounter" and an "alternative perceptual vantage point".'
      }
    ]
  }
];
