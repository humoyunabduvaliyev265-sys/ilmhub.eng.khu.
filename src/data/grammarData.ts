import { GrammarLesson } from '../types';

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  // A1 Level
  {
    id: 'g-a1-1',
    level: 'A1',
    title: 'Present Simple: Habits & Facts',
    uzbekTitle: 'Oddiy hozirgi zamon (Odatlar va faktlar)',
    summary: 'Master how to discuss routines, regular actions, and universal facts in English.',
    rules: [
      {
        heading: 'Structure & Rule',
        explanation: 'Use base verb for I / You / We / They. Add -s or -es to the verb for He / She / It.',
        uzbekExplanation: 'I, You, We, They uchun fe’lning o‘zi olinadi. He, She, It uchun fe’l oxiriga -s yoki -es qo‘shiladi.',
        examples: [
          { en: 'I study English every day at ILMHUB.', uz: 'Men har kuni ILMHUBda ingliz tilini o‘rganaman.' },
          { en: 'He speaks three languages fluently.', uz: 'U uchta tilda ravon gapiradi.' },
          { en: 'The sun rises in the east.', uz: 'Quyosh sharqdan chiqadi.' }
        ]
      },
      {
        heading: 'Negative & Questions',
        explanation: 'Use "do not" (don’t) for I/You/We/They and "does not" (doesn’t) for He/She/It. In questions, put Do or Does at the front.',
        uzbekExplanation: 'Inkor shaklida "don’t" yoki "doesn’t" ishlatiladi. So‘roqda Do yoki Does egadan oldinga o‘tadi.',
        examples: [
          { en: 'She doesn’t watch television on weekdays.', uz: 'U ish kunlarida televizor ko‘rmaydi.' },
          { en: 'Do you practice speaking every morning?', uz: 'Har kuni ertalab gapirishni mashq qilasizmi?' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-g-a1-1',
        question: 'The instructor _______ English at 8:00 PM every evening.',
        options: ['teaches', 'teach', 'teaching', 'is teach'],
        correctIndex: 0,
        explanation: 'Because "The instructor" is 3rd person singular (he/she), we add -es to the verb: "teaches".'
      },
      {
        id: 'ex-g-a1-2',
        question: '_______ you enjoy practicing pronunciation exercises?',
        options: ['Does', 'Do', 'Are', 'Is'],
        correctIndex: 1,
        explanation: 'With subject "you" in the Present Simple question, we use auxiliary verb "Do".'
      },
      {
        id: 'ex-g-a1-3',
        question: 'We _______ usually skip our vocabulary flashcard sessions.',
        options: ['doesn’t', 'don’t', 'not', 'aren’t'],
        correctIndex: 1,
        explanation: 'For subject "We", the negative auxiliary is "don’t".'
      }
    ]
  },
  {
    id: 'g-a1-2',
    level: 'A1',
    title: 'To Be (am / is / are)',
    uzbekTitle: '"To Be" fe’li (am / is / are)',
    summary: 'The foundation of English: expressing identity, location, feelings, and state.',
    rules: [
      {
        heading: 'Forms of To Be',
        explanation: 'I am, You are, He/She/It is, We are, They are.',
        uzbekExplanation: 'Shaxs va buyumlarning kimligi, holati va joylashuvini ifodalash uchun to be fe’li qo‘llaniladi.',
        examples: [
          { en: 'I am excited to learn English at ILMHUB.', uz: 'ILMHUBda ingliz tilini o‘rganishdan juda xursandman.' },
          { en: 'These lessons are very helpful.', uz: 'Bu darslar juda foydali.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-g-a1-4',
        question: 'They _______ students at ILMHUB Academy.',
        options: ['is', 'are', 'am', 'be'],
        correctIndex: 1,
        explanation: 'Plural subject "They" takes "are".'
      }
    ]
  },

  // A2 Level
  {
    id: 'g-a2-1',
    level: 'A2',
    title: 'Past Simple & Irregular Verbs',
    uzbekTitle: 'O‘tgan oddiy zamon va noto‘g‘ri fe’llar',
    summary: 'Talking about completed events in the past with regular (-ed) and irregular verbs.',
    rules: [
      {
        heading: 'Forming Past Simple',
        explanation: 'Regular verbs take -ed (worked, played). Irregular verbs change form (go -> went, take -> took, write -> wrote).',
        uzbekExplanation: 'To‘g‘ri fe’llarga -ed qo‘shiladi. Noto‘g‘ri fe’llar o‘zgaradi (masalan, go -> went, write -> wrote).',
        examples: [
          { en: 'Yesterday I finished my 20-word vocabulary test.', uz: 'Kecha men 20 ta so‘zdan iborat lug‘at testimni tugatdim.' },
          { en: 'The instructor taught a wonderful grammar class last Saturday.', uz: 'O‘tgan shanba kuni o‘qituvchi ajoyib grammatika darsi o‘tdi.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-g-a2-1',
        question: 'She _______ an essay about her future career yesterday.',
        options: ['writes', 'wrote', 'written', 'was write'],
        correctIndex: 1,
        explanation: 'Past Simple of "write" is irregular "wrote".'
      },
      {
        id: 'ex-g-a2-2',
        question: 'Did you _______ your test results on the dashboard?',
        options: ['saw', 'see', 'seen', 'seeing'],
        correctIndex: 1,
        explanation: 'After the auxiliary "Did", the main verb stays in base form: "see".'
      }
    ]
  },

  // B1 Level
  {
    id: 'g-b1-1',
    level: 'B1',
    title: 'Present Perfect vs. Past Simple',
    uzbekTitle: 'Present Perfect va Past Simple farqi',
    summary: 'Connecting past experiences to the present moment without mentioning a specific finished time.',
    rules: [
      {
        heading: 'Key Difference',
        explanation: 'Use Present Perfect (have/has + V3) for experiences, life events, or recent actions connected to now without a finished time marker (yesterday, in 2020).',
        uzbekExplanation: 'Agar harakatning natijasi hozirda muhim bo‘lsa yoki aniq tugagan vaqt ko‘rsatilmagan bo‘lsa, Present Perfect ishlatiladi.',
        examples: [
          { en: 'I have completed three grammar modules this week.', uz: 'Men bu hafta uchta grammatika modulini tamomladim.' },
          { en: 'He has lived in Tashkent for five years.', uz: 'U besh yildan beri Toshkentda yashab kelmoqda.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-g-b1-1',
        question: 'I _______ to London in 2022, but I _______ visited New York yet.',
        options: [
          'have gone / didn’t',
          'went / haven’t',
          'went / didn’t',
          'have been / haven’t'
        ],
        correctIndex: 1,
        explanation: '"In 2022" requires Past Simple ("went"), while "yet" requires Present Perfect ("haven’t visited").'
      },
      {
        id: 'ex-g-b1-2',
        question: 'How long _______ you _______ these English courses?',
        options: [
          'did / follow',
          'have / followed',
          'do / followed',
          'were / following'
        ],
        correctIndex: 1,
        explanation: '"How long" asking about an ongoing period up to now requires Present Perfect: "have you followed".'
      }
    ]
  },

  // B2 Level
  {
    id: 'g-b2-1',
    level: 'B2',
    title: 'Conditionals: Real & Unreal (0, 1st, 2nd, 3rd)',
    uzbekTitle: 'Shart mayllari (0, 1-, 2- va 3-tur shart jumlalari)',
    summary: 'Expressing real possibilities, hypothetical imaginations, and past regrets.',
    rules: [
      {
        heading: 'Second vs Third Conditional',
        explanation: 'Second Conditional (If + Past Simple, would + V1) for unreal present/future. Third Conditional (If + Past Perfect, would have + V3) for past regret.',
        uzbekExplanation: '2-shart mayli hozirgi noaniq farazlar uchun. 3-shart mayli esa o‘tmishdagi afsus va bajarilmagan shartlar uchun.',
        examples: [
          { en: 'If I practiced 1 hour daily, I would reach C1 in 6 months.', uz: 'Agar har kuni 1 soat mashq qilsam edi, 6 oyda C1 darajasiga yetgan bo‘lardim.' },
          { en: 'If you had revised the flashcards, you would have scored 100%.', uz: 'Agar kartochkalarni takrorlaganingizda edi, 100% ball olgan bo‘lardingiz.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-g-b2-1',
        question: 'If I _______ more time last night, I would have taken the 50-question test.',
        options: ['had', 'had had', 'have had', 'would have'],
        correctIndex: 1,
        explanation: 'Third conditional requires "had had" (Past Perfect) in the if-clause for an unreal past situation.'
      },
      {
        id: 'ex-g-b2-2',
        question: 'If she _______ harder, she would speak English like a native.',
        options: ['practiced', 'practicing', 'would practice', 'practices'],
        correctIndex: 0,
        explanation: 'Second conditional uses Past Simple ("practiced") in the if-clause for hypothetical situations.'
      }
    ]
  },

  // C1 Level
  {
    id: 'g-c1-1',
    level: 'C1',
    title: 'Inversion for Emphasis',
    uzbekTitle: 'Ta’kidlash uchun inversiya (Inversion)',
    summary: 'Stylistic and formal structures: Seldom, Rarely, Never, Under no circumstances.',
    rules: [
      {
        heading: 'Negative Adverbial Inversion',
        explanation: 'When negative or restrictive adverbs start the sentence, invert the auxiliary verb and the subject (like a question).',
        uzbekExplanation: 'Salbiy yoki cheklovchi so‘zlar (Seldom, Rarely, No sooner) gap boshiga kelganda yordamchi fe’l egadan oldinga o‘tadi.',
        examples: [
          { en: 'Rarely have I seen such dedication among language learners.', uz: 'Kamdan-kam hollarda til o‘rganuvchilarda bunday matonatni ko‘rganman.' },
          { en: 'Under no circumstances should you surrender your learning goals.', uz: 'Hech qanday holatda ham o‘quv maqsadlaringizdan voz kechmasligingiz kerak.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-g-c1-1',
        question: 'Hardly _______ started the presentation when the bell rang.',
        options: ['he had', 'had he', 'did he', 'he was'],
        correctIndex: 1,
        explanation: 'With "Hardly" at the sentence start, we invert: "had he started".'
      }
    ]
  },

  // C2 Level
  {
    id: 'g-c2-1',
    level: 'C2',
    title: 'Subjunctive Mood & Nuanced Modal Stance',
    uzbekTitle: 'Subjunctive Mood (Istak mayli) va murakkab modal tuzilmalar',
    summary: 'Formal recommendations, high-level diplomatic English, and native-level precision.',
    rules: [
      {
        heading: 'Subjunctive with Base Verbs',
        explanation: 'After verbs of demand/recommendation (insist, recommend, propose), use the bare base verb for all subjects.',
        uzbekExplanation: 'Tavsiya, talab bildiruvchi fe’llardan keyin shaxsga qaramasdan fe’lning sof boshlang‘ich shakli (infinitive without to) ishlatiladi.',
        examples: [
          { en: 'The instructor insisted that each student speak without fear.', uz: 'O‘qituvchi har bir o‘quvchining qo‘rqmasdan gapirishini qat’iy talab qildi.' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-g-c2-1',
        question: 'It is essential that every candidate _______ on time for the examination.',
        options: ['be', 'is', 'was', 'should be being'],
        correctIndex: 0,
        explanation: 'Subjunctive requires bare infinitive "be" after "It is essential that...".'
      }
    ]
  }
];
