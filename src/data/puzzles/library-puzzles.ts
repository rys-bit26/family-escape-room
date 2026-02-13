import type { PuzzleDefinition } from '../../types/puzzle.ts';

export const libraryPuzzles: PuzzleDefinition[] = [
  {
    id: 'library-code-lock',
    roomId: 'library',
    type: 'code_entry',
    name: 'Desk Lock',
    description: 'A 4-digit combination lock on the desk drawer.',
    data: {
      type: 'code_entry',
      codeLength: 4,
      correctCode: '3141',
      clueText: 'The globe might hold the answer...',
    },
    difficultyOverrides: {
      easy: {
        type: 'code_entry',
        codeLength: 4,
        correctCode: '3141',
        clueText: 'Look at the globe! The numbers scratched on it are important.',
      },
      hard: {
        type: 'code_entry',
        codeLength: 6,
        correctCode: '314159',
        clueText: 'A mathematician would know this number by heart...',
      },
    },
    solution: { type: 'code', code: '3141' },
    hints: [
      { tier: 1, text: 'Have you examined everything in the room?', autoShowOnEasy: true },
      { tier: 2, text: 'Look at the globe closely.' },
      { tier: 3, text: 'The numbers scratched on the globe base are the code.' },
    ],
    maxAttempts: { easy: 0, medium: 8, hard: 5 },
    rewardClue: 'The desk drawer clicks open, revealing a brass key inside.',
  },
  {
    id: 'library-pattern-match',
    roomId: 'library',
    type: 'pattern_match',
    name: 'Color Sequence',
    description: 'Behind the painting is a panel with colored buttons.',
    data: {
      type: 'pattern_match',
      symbols: ['red', 'blue', 'green', 'yellow', 'purple'],
      gridSize: 4,
      correctPattern: ['red', 'blue', 'green', 'yellow'],
    },
    difficultyOverrides: {
      easy: {
        type: 'pattern_match',
        symbols: ['red', 'blue', 'green', 'yellow'],
        gridSize: 4,
        correctPattern: ['red', 'blue', 'green', 'yellow'],
      },
      hard: {
        type: 'pattern_match',
        symbols: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
        gridSize: 6,
        correctPattern: ['red', 'blue', 'green', 'yellow', 'red', 'blue'],
      },
    },
    solution: { type: 'pattern', pattern: ['red', 'blue', 'green', 'yellow'] },
    hints: [
      { tier: 1, text: 'The bookshelf might tell you the order.', autoShowOnEasy: true },
      { tier: 2, text: 'Look at the colored book spines from left to right.' },
      { tier: 3, text: 'Red, Blue, Green, Yellow — that is the order.' },
    ],
    maxAttempts: { easy: 0, medium: 6, hard: 4 },
    rewardClue: 'A slip of paper falls out: "The answer is always KNOWLEDGE."',
  },
  {
    id: 'library-riddle',
    roomId: 'library',
    type: 'riddle',
    name: 'The Cabinet Riddle',
    description: 'A riddle is inscribed on the inside of the cabinet door.',
    data: {
      type: 'riddle',
      riddleText: 'I have pages but am not a tree.\nI have a spine but no bones.\nI tell stories but cannot speak.\nWhat am I?',
      acceptableAnswers: ['book', 'a book', 'books'],
    },
    difficultyOverrides: {
      easy: {
        type: 'riddle',
        riddleText: 'I have pages but am not a tree.\nI have a spine but no bones.\nI tell stories but cannot speak.\nWhat am I?\n\n(Hint: You are in a room full of them!)',
        acceptableAnswers: ['book', 'a book', 'books'],
      },
      hard: {
        type: 'riddle',
        riddleText: 'My body is thin and my voice long gone,\nYet through me, a thousand voices speak on.\nI stand in rows like soldiers in line,\nBearing the weight of knowledge and time.\nI can be opened but I am not a door.\nWhat am I?',
        acceptableAnswers: ['book', 'a book', 'books'],
      },
    },
    solution: { type: 'text', answers: ['book', 'a book', 'books'] },
    hints: [
      { tier: 1, text: 'Look around the room for inspiration.' },
      { tier: 2, text: 'The answer is something found on every shelf here.' },
      { tier: 3, text: 'It is a book.' },
    ],
    maxAttempts: { easy: 0, medium: 5, hard: 3 },
    rewardClue: 'Inside the cabinet: "Exit code = first digit of pi + vowels in KNOWLEDGE"',
  },
  {
    id: 'library-exit-code',
    roomId: 'library',
    type: 'code_entry',
    name: 'Exit Door Lock',
    description: 'The door to freedom has a keypad.',
    data: {
      type: 'code_entry',
      codeLength: 2,
      correctCode: '34',
      clueText: 'Combine clues from the puzzles you have solved.',
    },
    difficultyOverrides: {
      easy: {
        type: 'code_entry',
        codeLength: 2,
        correctCode: '34',
        clueText: 'First digit of pi is 3. KNOWLEDGE has 4 vowels (O, W doesn\'t count, L... just the vowels: O, E, E... hmm). Try 34!',
      },
      hard: {
        type: 'code_entry',
        codeLength: 4,
        correctCode: '3427',
        clueText: 'The door demands more than a simple sum. Think deeper.',
      },
    },
    solution: { type: 'code', code: '34' },
    hints: [
      { tier: 1, text: 'Check your journal for clues from solved puzzles.' },
      { tier: 2, text: 'First digit of pi = 3. Count the vowels in KNOWLEDGE.' },
      { tier: 3, text: 'KNOWLEDGE has vowels K-N-O-W-L-E-D-G-E: O, E, E plus the silent A? The code is 34.' },
    ],
    maxAttempts: { easy: 0, medium: 6, hard: 4 },
    rewardClue: 'The door swings open! You escaped the library!',
  },
];
