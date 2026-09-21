import { ListeningExercise } from '../types';

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'list-1',
    level: 'A1',
    title: 'First Day at ILMHUB English',
    topic: 'Introductions & Greetings',
    speaker: 'Teacher David',
    audioText: 'Welcome to ILMHUB English! My name is David, and I will be your guide on this learning journey. Every day, we practice new words, explore grammar rules, and speak with confidence. Remember: consistency is the secret to fluency. Let’s get started!',
    questions: [
      {
        id: 'lq-1-1',
        question: 'What is the teacher’s name in the audio?',
        options: ['David', 'Alexander', 'Farrukh', 'Arthur'],
        correctIndex: 0,
        explanation: 'The speaker introduces himself: "My name is David".'
      },
      {
        id: 'lq-1-2',
        question: 'According to the teacher, what is the secret to fluency?',
        options: ['Expensive books', 'Consistency', 'Living abroad', 'Passing tests only'],
        correctIndex: 1,
        explanation: 'He states: "consistency is the secret to fluency".'
      }
    ]
  },
  {
    id: 'list-2',
    level: 'A2',
    title: 'Planning a Study Schedule',
    topic: 'Daily Routines & Habits',
    speaker: 'Malika, ILMHUB Student',
    audioText: 'I usually study English for twenty minutes in the morning and fifteen minutes before going to sleep. In the morning, I review my vocabulary flashcards on ILMHUB and test myself on ten words. In the evening, I listen to a short conversation and repeat the sentences out loud. This routine has doubled my confidence.',
    questions: [
      {
        id: 'lq-2-1',
        question: 'How long does Malika study English in the morning?',
        options: ['10 minutes', '20 minutes', '45 minutes', '1 hour'],
        correctIndex: 1,
        explanation: 'She says: "I usually study English for twenty minutes in the morning".'
      },
      {
        id: 'lq-2-2',
        question: 'What does she do during her evening study session?',
        options: ['Reads grammar rules', 'Listens to a conversation and repeats sentences', 'Writes an essay', 'Watches a movie'],
        correctIndex: 1,
        explanation: 'She mentions: "In the evening, I listen to a short conversation and repeat the sentences out loud".'
      }
    ]
  },
  {
    id: 'list-3',
    level: 'B1',
    title: 'The Art of Conversation',
    topic: 'Communication Skills',
    speaker: 'Arthur, Senior Instructor',
    audioText: 'Many students worry about making small grammatical errors while speaking. However, in international communication, clarity and expression are far more critical than absolute perfection. When you converse, focus on getting your message across, maintaining eye contact, and actively listening to your partner.',
    questions: [
      {
        id: 'lq-3-1',
        question: 'What is considered more critical than absolute perfection?',
        options: ['Clarity and expression', 'Speed of talking', 'Using rare vocabulary', 'Complex grammar rules'],
        correctIndex: 0,
        explanation: 'The instructor says: "clarity and expression are far more critical than absolute perfection".'
      }
    ]
  },
  {
    id: 'list-4',
    level: 'B2',
    title: 'Technology in Language Education',
    topic: 'Modern Education & AI',
    speaker: 'Tech Educationalist',
    audioText: 'Modern interactive platforms have revolutionized how we acquire second languages. Instead of passive rote memorization, students now engage with dynamic spaced repetition, adaptive tests, and instant speech synthesis. This multi-sensory feedback loop accelerates neural retention and turns abstract rules into living communication.',
    questions: [
      {
        id: 'lq-4-1',
        question: 'What type of learning is replaced by modern interactive platforms?',
        options: ['Active conversation', 'Passive rote memorization', 'Group debates', 'Listening to music'],
        correctIndex: 1,
        explanation: 'The speaker contrasts modern platforms with "passive rote memorization".'
      }
    ]
  },
  {
    id: 'list-5',
    level: 'C1',
    title: 'Linguistic Nuance and Pragmatic Competence',
    topic: 'Advanced Linguistics',
    speaker: 'Academic Lecturer',
    audioText: 'Achieving advanced C1 fluency extends beyond lexical breadth; it demands pragmatic competence. A speaker must intuitively gauge the register of discourse, discerning when an understated euphemism carries more weight than an assertive declaration. Language becomes an instrument of subtle diplomacy and strategic rhetoric.',
    questions: [
      {
        id: 'lq-5-1',
        question: 'What does advanced C1 fluency demand in addition to lexical breadth?',
        options: ['Speed reading', 'Pragmatic competence', 'Memorizing slang', 'Writing long essays'],
        correctIndex: 1,
        explanation: 'The lecturer notes: "it demands pragmatic competence".'
      }
    ]
  },
  {
    id: 'list-6',
    level: 'C2',
    title: 'The Evolution of Global English',
    topic: 'World Englishes & Cultural Semantics',
    speaker: 'Professor of English Philology',
    audioText: 'The contemporary trajectory of English reflects an intricate tapestry of regional idioms, cultural adaptations, and cross-pollinated syntactical idioms. As English continues its trajectory as a global lingua franca, native idiomatic orthodoxies increasingly yield to pragmatic mutual intelligibility among diverse global communities.',
    questions: [
      {
        id: 'lq-6-1',
        question: 'What are native idiomatic orthodoxies yielding to?',
        options: ['Grammar tests', 'Pragmatic mutual intelligibility', 'Ancient languages', 'Regional isolation'],
        correctIndex: 1,
        explanation: 'The professor states they yield to "pragmatic mutual intelligibility".'
      }
    ]
  }
];
