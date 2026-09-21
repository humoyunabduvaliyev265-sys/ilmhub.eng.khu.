import { TestQuestion } from '../types';

export const TEST_QUESTION_BANK: TestQuestion[] = [
  // 1
  {
    id: 'tq-1',
    level: 'A1',
    category: 'Grammar',
    question: 'The instructor _______ from Uzbekistan and teaches English.',
    options: ['are', 'is', 'am', 'be'],
    correctIndex: 1,
    explanation: 'Singular third-person subject "The instructor" takes the present form "is".'
  },
  // 2
  {
    id: 'tq-2',
    level: 'A1',
    category: 'Vocabulary',
    question: 'Which word means "yutuq" or "muvaffaqiyat" in Uzbek?',
    options: ['Challenge', 'Achievement', 'Mistake', 'Schedule'],
    correctIndex: 1,
    explanation: '"Achievement" translates to "yutuq, muvaffaqiyat".'
  },
  // 3
  {
    id: 'tq-3',
    level: 'A1',
    category: 'Grammar',
    question: 'How _______ new words do you learn every day?',
    options: ['much', 'many', 'long', 'often'],
    correctIndex: 1,
    explanation: '"Words" is a countable plural noun, so we use "many".'
  },
  // 4
  {
    id: 'tq-4',
    level: 'A2',
    category: 'Grammar',
    question: 'Yesterday, she _______ her first interactive vocabulary lesson on ILMHUB.',
    options: ['completes', 'completed', 'has completed', 'was complete'],
    correctIndex: 1,
    explanation: 'The past time marker "Yesterday" takes the simple past tense "completed".'
  },
  // 5
  {
    id: 'tq-5',
    level: 'A2',
    category: 'Everyday English',
    question: 'Choose the natural response to: "Thank you for helping me with my pronunciation!"',
    options: ['You are welcome!', 'Please no.', 'Yes, I am.', 'I don’t mind you.'],
    correctIndex: 0,
    explanation: '"You are welcome!" is the polite standard English reply to thanks.'
  },
  // 6
  {
    id: 'tq-6',
    level: 'A2',
    category: 'Grammar',
    question: 'This English course is _______ than the one I took last year.',
    options: ['more useful', 'usefuler', 'most useful', 'as useful'],
    correctIndex: 0,
    explanation: 'For multi-syllable adjectives like "useful", the comparative form is "more useful".'
  },
  // 7
  {
    id: 'tq-7',
    level: 'B1',
    category: 'Grammar',
    question: 'I have been studying English at ILMHUB _______ three months.',
    options: ['since', 'for', 'during', 'from'],
    correctIndex: 1,
    explanation: 'We use "for" with a duration of time (three months).'
  },
  // 8
  {
    id: 'tq-8',
    level: 'B1',
    category: 'Collocations',
    question: 'It is important to _______ notes during the listening exercise.',
    options: ['make', 'take', 'do', 'catch'],
    correctIndex: 1,
    explanation: 'The natural English collocation is "to take notes" (or "make notes", but "take notes" is standard).'
  },
  // 9
  {
    id: 'tq-9',
    level: 'B1',
    category: 'Vocabulary',
    question: 'What is the opposite of the word "FLUENT"?',
    options: ['Hesitant', 'Articulate', 'Quick', 'Confident'],
    correctIndex: 0,
    explanation: '"Hesitant" (ikkilanuvchan, to‘xtalib qoluvchi) is the antonym of fluent.'
  },
  // 10
  {
    id: 'tq-10',
    level: 'B1',
    category: 'Grammar',
    question: 'If you _______ practicing daily, your speaking will become automatic.',
    options: ['keep', 'will keep', 'kept', 'had kept'],
    correctIndex: 0,
    explanation: 'First conditional uses Present Simple ("keep") in the if-clause.'
  },
  // 11
  {
    id: 'tq-11',
    level: 'B2',
    category: 'Grammar',
    question: 'By this time next year, I _______ my C1 English examination.',
    options: ['will pass', 'will have passed', 'have passed', 'am passing'],
    correctIndex: 1,
    explanation: '"By this time next year" requires Future Perfect ("will have passed").'
  },
  // 12
  {
    id: 'tq-12',
    level: 'B2',
    category: 'Collocations',
    question: 'She made a strong _______ on the interview committee.',
    options: ['expression', 'impression', 'affect', 'result'],
    correctIndex: 1,
    explanation: 'The established idiom/collocation is "to make an impression on someone".'
  },
  // 13
  {
    id: 'tq-13',
    level: 'B2',
    category: 'Grammar',
    question: 'He wouldn’t have failed the grammar quiz if he _______ the rules carefully.',
    options: ['revised', 'had revised', 'would revise', 'has revised'],
    correctIndex: 1,
    explanation: 'Third conditional if-clause takes Past Perfect ("had revised").'
  },
  // 14
  {
    id: 'tq-14',
    level: 'B2',
    category: 'Idioms',
    question: 'What does the idiom "once in a blue moon" mean?',
    options: ['Very frequently', 'Almost never / Very rarely', 'During the night', 'With great sadness'],
    correctIndex: 1,
    explanation: '"Once in a blue moon" means very rarely or hardly ever.'
  },
  // 15
  {
    id: 'tq-15',
    level: 'C1',
    category: 'Grammar',
    question: 'Rarely _______ such an exceptional performance in the IELTS speaking test.',
    options: ['we have witnessed', 'have we witnessed', 'we witnessed', 'did we witnessed'],
    correctIndex: 1,
    explanation: 'Negative adverb "Rarely" at the start causes subject-auxiliary inversion: "have we witnessed".'
  },
  // 16
  {
    id: 'tq-16',
    level: 'C1',
    category: 'Vocabulary',
    question: 'The speaker’s arguments were so _______ that everyone in the hall agreed.',
    options: ['compelling', 'monotonous', 'vague', 'trivial'],
    correctIndex: 0,
    explanation: '"Compelling" means powerfully persuasive and convincing.'
  },
  // 17
  {
    id: 'tq-17',
    level: 'C1',
    category: 'Collocations',
    question: 'The instructor urged students not to take progress for _______ and to keep working.',
    options: ['sure', 'granted', 'given', 'true'],
    correctIndex: 1,
    explanation: 'The fixed expression is "take something for granted".'
  },
  // 18
  {
    id: 'tq-18',
    level: 'C2',
    category: 'Vocabulary',
    question: 'Which word describes someone with sharp discernment and keen insight?',
    options: ['Perspicacious', 'Loquacious', 'Fallacious', 'Voracious'],
    correctIndex: 0,
    explanation: '"Perspicacious" means having great mental insight and understanding.'
  },
  // 19
  {
    id: 'tq-19',
    level: 'C2',
    category: 'Grammar',
    question: 'The committee insisted that the standard _______ maintained without compromise.',
    options: ['is', 'be', 'was', 'were'],
    correctIndex: 1,
    explanation: 'Formal mandative subjunctive requires the base form "be".'
  },
  // 20
  {
    id: 'tq-20',
    level: 'A1',
    category: 'Grammar',
    question: 'Where _______ your English teacher live?',
    options: ['do', 'does', 'is', 'are'],
    correctIndex: 1,
    explanation: '"Your English teacher" is third person singular (he/she), so we use "does".'
  },
  // 21
  {
    id: 'tq-21',
    level: 'A2',
    category: 'Vocabulary',
    question: 'If you want to look up a word, you consult a _______.',
    options: ['dictionary', 'calculator', 'calendar', 'mirror'],
    correctIndex: 0,
    explanation: 'A "dictionary" contains word definitions, phonetic pronunciations, and examples.'
  },
  // 22
  {
    id: 'tq-22',
    level: 'A2',
    category: 'Grammar',
    question: 'I usually wake up early, _______ on Sundays I sleep until 9:00 AM.',
    options: ['because', 'but', 'so', 'although'],
    correctIndex: 1,
    explanation: '"But" expresses contrast between weekdays and Sundays.'
  },
  // 23
  {
    id: 'tq-23',
    level: 'B1',
    category: 'Reading',
    question: 'Read the phrase: "Continuous learning fosters intellectual agility." What does "fosters" mean?',
    options: ['Prevents', 'Encourages and nurtures', 'Destroys', 'Delays'],
    correctIndex: 1,
    explanation: '"Foster" means to encourage the development or growth of something.'
  },
  // 24
  {
    id: 'tq-24',
    level: 'B1',
    category: 'Collocations',
    question: 'You must _______ an effort to practice speaking English aloud.',
    options: ['do', 'make', 'give', 'build'],
    correctIndex: 1,
    explanation: 'The natural collocation is "to make an effort".'
  },
  // 25
  {
    id: 'tq-25',
    level: 'B2',
    category: 'Grammar',
    question: 'I wish I _______ more time to practice advanced idioms every day.',
    options: ['have', 'had', 'have had', 'would have had'],
    correctIndex: 1,
    explanation: 'To express a present wish or regret, use "wish + Past Simple" ("had").'
  },
  // 26
  {
    id: 'tq-26',
    level: 'B2',
    category: 'Vocabulary',
    question: 'Which of the following words is a synonym for "PRAGMATIC"?',
    options: ['Idealistic', 'Practical', 'Theoretical', 'Irrational'],
    correctIndex: 1,
    explanation: '"Pragmatic" means dealing with things sensibly and realistically; practical.'
  },
  // 27
  {
    id: 'tq-27',
    level: 'C1',
    category: 'Grammar',
    question: 'No sooner had the teacher entered the classroom _______ the students started asking questions.',
    options: ['when', 'than', 'then', 'as'],
    correctIndex: 1,
    explanation: '"No sooner... than" is the standard correlative comparative pair.'
  },
  // 28
  {
    id: 'tq-28',
    level: 'C1',
    category: 'Everyday English',
    question: 'What does "to beat around the bush" mean?',
    options: ['To speak directly', 'To avoid coming to the main point', 'To do gardening', 'To defeat a rival'],
    correctIndex: 1,
    explanation: '"Beat around the bush" means discussing a matter without speaking directly about the issue.'
  },
  // 29
  {
    id: 'tq-29',
    level: 'C2',
    category: 'Collocations',
    question: 'Her sudden breakthrough was a testament _______ the power of relentless effort.',
    options: ['to', 'of', 'for', 'with'],
    correctIndex: 0,
    explanation: 'The correct dependent preposition with "a testament" is "to" ("a testament to").'
  },
  // 30
  {
    id: 'tq-30',
    level: 'A1',
    category: 'Vocabulary',
    question: 'What is the plural of "child"?',
    options: ['childs', 'children', 'childrens', 'childes'],
    correctIndex: 1,
    explanation: 'The irregular plural of "child" is "children".'
  },
  // 31
  {
    id: 'tq-31',
    level: 'A2',
    category: 'Grammar',
    question: 'While I _______ my homework, my brother was watching a video.',
    options: ['am doing', 'did', 'was doing', 'have done'],
    correctIndex: 2,
    explanation: 'For an action in progress in the past alongside another, we use Past Continuous ("was doing").'
  },
  // 32
  {
    id: 'tq-32',
    level: 'B1',
    category: 'Grammar',
    question: 'Neither the teacher nor the students _______ present in the hall yesterday.',
    options: ['was', 'were', 'is', 'are'],
    correctIndex: 1,
    explanation: 'With "neither... nor", the verb agrees with the closer subject ("students" - plural = "were").'
  },
  // 33
  {
    id: 'tq-33',
    level: 'B1',
    category: 'Vocabulary',
    question: 'Which word best completes: "His explanation was very _______, so everybody understood immediately."',
    options: ['lucid', 'obscure', 'hostile', 'ambiguous'],
    correctIndex: 0,
    explanation: '"Lucid" means expressed clearly and easy to understand.'
  },
  // 34
  {
    id: 'tq-34',
    level: 'B2',
    category: 'Reading',
    question: 'Identify the sentence with correct punctuation and relative clause:',
    options: [
      'Mr. Arthur who founded the academy teaches English.',
      'Mr. Arthur, who founded the academy, teaches English.',
      'Mr. Arthur that founded the academy, teaches English.',
      'Mr. Arthur, whom founded the academy teaches English.'
    ],
    correctIndex: 1,
    explanation: 'Non-defining relative clauses giving extra detail about a specific person require surrounding commas and "who".'
  },
  // 35
  {
    id: 'tq-35',
    level: 'C1',
    category: 'Vocabulary',
    question: 'The word "UBIQUITOUS" most closely means:',
    options: ['Omnipresent / found everywhere', 'Extremely rare', 'Harmful and dangerous', 'Temporary'],
    correctIndex: 0,
    explanation: '"Ubiquitous" means present, appearing, or found everywhere.'
  },
  // 36
  {
    id: 'tq-36',
    level: 'A1',
    category: 'Everyday English',
    question: 'How do you ask about someone’s profession?',
    options: ['What do you do?', 'How do you do?', 'Where do you do?', 'Who do you make?'],
    correctIndex: 0,
    explanation: '"What do you do?" is the customary English question asking what someone does for work.'
  },
  // 37
  {
    id: 'tq-37',
    level: 'A2',
    category: 'Grammar',
    question: 'She hasn’t phoned me _______ last Monday.',
    options: ['for', 'since', 'ago', 'during'],
    correctIndex: 1,
    explanation: '"Since" marks the specific starting point in time ("last Monday").'
  },
  // 38
  {
    id: 'tq-38',
    level: 'B1',
    category: 'Grammar',
    question: 'You _______ wear a formal suit to the speaking club, it’s casual.',
    options: ['mustn’t', 'don’t have to', 'shouldn’t', 'can’t'],
    correctIndex: 1,
    explanation: '"Don’t have to" indicates absence of obligation (it is not necessary).'
  },
  // 39
  {
    id: 'tq-39',
    level: 'B2',
    category: 'Collocations',
    question: 'The young entrepreneur decided to _______ advantage of the new scholarship.',
    options: ['make', 'take', 'have', 'catch'],
    correctIndex: 1,
    explanation: 'The idiom is "take advantage of".'
  },
  // 40
  {
    id: 'tq-40',
    level: 'C2',
    category: 'Idioms',
    question: 'What does "to throw in the towel" mean?',
    options: ['To clean up a room', 'To admit defeat or quit', 'To start a shower', 'To challenge an opponent'],
    correctIndex: 1,
    explanation: '"Throw in the towel" is a boxing metaphor meaning to surrender or give up.'
  },
  // 41
  {
    id: 'tq-41',
    level: 'A2',
    category: 'Vocabulary',
    question: 'Which of these is NOT a season?',
    options: ['Autumn', 'Summer', 'Century', 'Winter'],
    correctIndex: 2,
    explanation: '"Century" is a period of 100 years, not a climatic season.'
  },
  // 42
  {
    id: 'tq-42',
    level: 'B1',
    category: 'Grammar',
    question: 'The book _______ by the instructor last month received stellar reviews.',
    options: ['recommending', 'recommended', 'which recommend', 'was recommended'],
    correctIndex: 1,
    explanation: 'Past participle reduced relative clause: "The book [which was] recommended by the instructor...".'
  },
  // 43
  {
    id: 'tq-43',
    level: 'B2',
    category: 'Grammar',
    question: 'Despite _______ late due to traffic, he managed to answer all 50 questions.',
    options: ['arrive', 'arrived', 'arriving', 'having arrive'],
    correctIndex: 2,
    explanation: 'Preposition "despite" is followed by a gerund (-ing form): "arriving".'
  },
  // 44
  {
    id: 'tq-44',
    level: 'C1',
    category: 'Vocabulary',
    question: 'A person who speaks many foreign languages with high fluency is called a _______.',
    options: ['polyglot', 'pedagogue', 'philanthropist', 'monoglot'],
    correctIndex: 0,
    explanation: 'A "polyglot" is someone who knows and is able to use several languages.'
  },
  // 45
  {
    id: 'tq-45',
    level: 'A1',
    category: 'Grammar',
    question: 'Look! It _______ outside right now.',
    options: ['snows', 'is snowing', 'snowed', 'was snow'],
    correctIndex: 1,
    explanation: '"Look!" and "right now" signal an action in progress: Present Continuous "is snowing".'
  },
  // 46
  {
    id: 'tq-46',
    level: 'A2',
    category: 'Vocabulary',
    question: 'What is the Uzbek equivalent of "Fluency"?',
    options: ['Ravonlik', 'Qiyinchilik', 'Xatolik', 'Reja'],
    correctIndex: 0,
    explanation: '"Fluency" translates to "ravonlik" in Uzbek.'
  },
  // 47
  {
    id: 'tq-47',
    level: 'B1',
    category: 'Everyday English',
    question: 'Choose the most appropriate phrase to politely disagree in a formal discussion:',
    options: [
      'You are completely wrong.',
      'I see your point, but I have a slightly different perspective.',
      'No way!',
      'Stop saying that.'
    ],
    correctIndex: 1,
    explanation: '"I see your point, but I have a slightly different perspective" is standard diplomatic English.'
  },
  // 48
  {
    id: 'tq-48',
    level: 'B2',
    category: 'Vocabulary',
    question: 'Choose the word that means "lasting for only a very short time":',
    options: ['Ephemeral', 'Perpetual', 'Tenacious', 'Indelible'],
    correctIndex: 0,
    explanation: '"Ephemeral" means short-lived or transient.'
  },
  // 49
  {
    id: 'tq-49',
    level: 'C1',
    category: 'Grammar',
    question: 'Were it not for your assistance, I _______ finished this complex task.',
    options: ['would never have', 'will never have', 'can never have', 'did never have'],
    correctIndex: 0,
    explanation: 'Inverted conditional structure equivalent to "If it were not for... I would never have finished".'
  },
  // 50
  {
    id: 'tq-50',
    level: 'C2',
    category: 'Reading',
    question: 'The term "oxymoron" refers to:',
    options: [
      'A figure of speech where contradictory terms appear in conjunction (e.g. deafening silence)',
      'An exaggeration used for literary effect',
      'A comparison using "like" or "as"',
      'Giving human traits to non-human objects'
    ],
    correctIndex: 0,
    explanation: 'An oxymoron juxtaposes seemingly contradictory words, such as "deafening silence" or "bittersweet".'
  },
  // 51
  {
    id: 'tq-51',
    level: 'B1',
    category: 'Collocations',
    question: 'Regular practice will help you _______ confidence in public speaking.',
    options: ['gain', 'win', 'earn', 'catch'],
    correctIndex: 0,
    explanation: 'We say "gain confidence" or "build confidence".'
  },
  // 52
  {
    id: 'tq-52',
    level: 'B2',
    category: 'Grammar',
    question: 'She had her presentation _______ by an English native speaker before the conference.',
    options: ['proofread', 'proofreading', 'to proofread', 'was proofread'],
    correctIndex: 0,
    explanation: 'Causative form: "have something done" -> "had her presentation proofread" (past participle).'
  },
  // 53
  {
    id: 'tq-53',
    level: 'A2',
    category: 'Grammar',
    question: 'I don’t have _______ free time this afternoon.',
    options: ['some', 'any', 'many', 'a'],
    correctIndex: 1,
    explanation: 'In negative sentences with uncountable nouns like "time", we use "any".'
  },
  // 54
  {
    id: 'tq-54',
    level: 'C1',
    category: 'Vocabulary',
    question: 'Which word means "very careful and showing great attention to detail"?',
    options: ['Meticulous', 'Careless', 'Hasty', 'Obtuse'],
    correctIndex: 0,
    explanation: '"Meticulous" means showing great attention to every small detail.'
  },
  // 55
  {
    id: 'tq-55',
    level: 'C2',
    category: 'Grammar',
    question: 'Scarcely had she stepped onto the podium _______ the applause erupted.',
    options: ['when', 'than', 'as', 'that'],
    correctIndex: 0,
    explanation: '"Scarcely... when" is the correct correlative adverbial pair in literary English.'
  }
];
