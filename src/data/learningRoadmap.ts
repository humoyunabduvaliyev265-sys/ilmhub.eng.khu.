import { RoadmapUnit } from '../types';

export const LEARNING_ROADMAP: RoadmapUnit[] = [
  // A1 Units
  {
    id: 'u-a1-1',
    level: 'A1',
    unitNumber: 1,
    title: 'Unit 1: Foundations & Introductions',
    description: 'Learn greetings, introducing yourself, basic pronouns, and the verb "to be".',
    lessons: [
      {
        id: 'l-a1-1-1',
        title: 'Meeting & Greeting',
        type: 'dialogue',
        xpReward: 15,
        questions: [
          {
            type: 'choice',
            prompt: 'Choose the best greeting for 9:00 in the morning:',
            options: ['Good evening', 'Good morning', 'Good night', 'Goodbye'],
            correctAnswer: 1,
            explanation: '"Good morning" is used before 12:00 PM.'
          },
          {
            type: 'translate',
            prompt: 'Translate to English: "Mening ismim John."',
            uzbekPrompt: 'Mening ismim John.',
            options: ['My name is John.', 'I has name John.', 'His name is John.', 'Me am John.'],
            correctAnswer: 0,
            explanation: '"My name is..." is the correct English phrase.'
          },
          {
            type: 'fill',
            prompt: 'Complete: "Nice to _______ you!"',
            options: ['meet', 'see', 'look', 'know'],
            correctAnswer: 0,
            explanation: '"Nice to meet you" is the natural phrase when being introduced.'
          }
        ]
      },
      {
        id: 'l-a1-1-2',
        title: 'Verb "To Be" Basics',
        type: 'grammar',
        xpReward: 20,
        questions: [
          {
            type: 'choice',
            prompt: 'Complete the sentence: "I _______ a dedicated student at ILMHUB."',
            options: ['is', 'are', 'am', 'be'],
            correctAnswer: 2,
            explanation: 'Subject "I" always pairs with "am".'
          },
          {
            type: 'choice',
            prompt: '"They _______ in the classroom right now."',
            options: ['are', 'is', 'am', 'be'],
            correctAnswer: 0,
            explanation: 'Plural "They" takes "are".'
          }
        ]
      }
    ]
  },
  {
    id: 'u-a1-2',
    level: 'A1',
    unitNumber: 2,
    title: 'Unit 2: Daily Routines & Actions',
    description: 'Describe what you do every day with Present Simple and frequency adverbs.',
    lessons: [
      {
        id: 'l-a1-2-1',
        title: 'Daily Activities',
        type: 'vocab',
        xpReward: 20,
        questions: [
          {
            type: 'choice',
            prompt: 'What is the opposite of "wake up"?',
            options: ['Go to sleep', 'Eat breakfast', 'Study grammar', 'Take notes'],
            correctAnswer: 0,
            explanation: '"Go to sleep" is the opposite of "wake up".'
          },
          {
            type: 'choice',
            prompt: 'She _______ to the ILMHUB center at 8:00 AM every weekday.',
            options: ['go', 'goes', 'going', 'is go'],
            correctAnswer: 1,
            explanation: 'He/She/It takes "-es": "goes".'
          }
        ]
      }
    ]
  },

  // A2 Units
  {
    id: 'u-a2-1',
    level: 'A2',
    unitNumber: 1,
    title: 'Unit 1: Past Memories & Milestones',
    description: 'Talk about past events, weekend trips, and historical milestones using Past Simple.',
    lessons: [
      {
        id: 'l-a2-1-1',
        title: 'Irregular Verbs in Action',
        type: 'grammar',
        xpReward: 25,
        questions: [
          {
            type: 'choice',
            prompt: 'Yesterday the instructor _______ us three effective vocabulary strategies.',
            options: ['taught', 'teached', 'teaching', 'was teach'],
            correctAnswer: 0,
            explanation: 'The past tense of "teach" is irregular: "taught".'
          },
          {
            type: 'choice',
            prompt: 'We _______ our interactive English test last night.',
            options: ['took', 'taked', 'taking', 'are take'],
            correctAnswer: 0,
            explanation: 'The past tense of "take" is "took".'
          }
        ]
      }
    ]
  },

  // B1 Units
  {
    id: 'u-b1-1',
    level: 'B1',
    unitNumber: 1,
    title: 'Unit 1: Experiences & Present Perfect',
    description: 'Connecting past experiences to the present without finished time words.',
    lessons: [
      {
        id: 'l-b1-1-1',
        title: 'Have You Ever...?',
        type: 'dialogue',
        xpReward: 30,
        questions: [
          {
            type: 'choice',
            prompt: '"Have you ever _______ in front of a big audience?"',
            options: ['spoken', 'spoke', 'speak', 'speaking'],
            correctAnswer: 0,
            explanation: 'Present Perfect question uses past participle V3: "spoken".'
          },
          {
            type: 'choice',
            prompt: 'I haven’t finished checking my answers _______ .',
            options: ['yet', 'already', 'never', 'since'],
            correctAnswer: 0,
            explanation: '"Yet" is used at the end of negative sentences and questions in Present Perfect.'
          }
        ]
      }
    ]
  },

  // B2 Units
  {
    id: 'u-b2-1',
    level: 'B2',
    unitNumber: 1,
    title: 'Unit 1: Nuanced Opinions & Conditionals',
    description: 'Formulate diplomatic arguments and construct 2nd and 3rd conditionals.',
    lessons: [
      {
        id: 'l-b2-1-1',
        title: 'Hypothetical Thinking',
        type: 'grammar',
        xpReward: 35,
        questions: [
          {
            type: 'choice',
            prompt: 'If I _______ in London, I would attend the British Library every weekend.',
            options: ['lived', 'would live', 'had lived', 'am living'],
            correctAnswer: 0,
            explanation: 'Second conditional uses Past Simple ("lived") in the condition clause.'
          }
        ]
      }
    ]
  },

  // C1 Units
  {
    id: 'u-c1-1',
    level: 'C1',
    unitNumber: 1,
    title: 'Unit 1: Stylistic Rhetoric & Inversion',
    description: 'High-level rhetorical emphasis, cleft sentences, and formal inversion.',
    lessons: [
      {
        id: 'l-c1-1-1',
        title: 'Negative Inversion Mastery',
        type: 'grammar',
        xpReward: 40,
        questions: [
          {
            type: 'choice',
            prompt: 'Under no circumstances _______ the password be revealed to unauthorized users.',
            options: ['should', 'it should', 'should it', 'shall it to'],
            correctAnswer: 0,
            explanation: 'Inversion: "Under no circumstances should the password be...".'
          }
        ]
      }
    ]
  },

  // C2 Units
  {
    id: 'u-c2-1',
    level: 'C2',
    unitNumber: 1,
    title: 'Unit 1: Linguistic Mastery & Nuance',
    description: 'Idiomatic fluency, subtle semantic registers, and stylistic eloquence.',
    lessons: [
      {
        id: 'l-c2-1-1',
        title: 'The Subjunctive & Discourse Nuance',
        type: 'quiz',
        xpReward: 50,
        questions: [
          {
            type: 'choice',
            prompt: 'The instructor recommended that every student _______ the speech out loud.',
            options: ['practice', 'practices', 'practiced', 'should be practiced'],
            correctAnswer: 0,
            explanation: 'Mandative subjunctive requires bare infinitive: "practice".'
          }
        ]
      }
    ]
  }
];
