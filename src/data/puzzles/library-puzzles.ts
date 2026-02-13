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
    solution: { type: 'code', code: '3141' },
    hints: [
      { tier: 1, text: 'Have you examined everything in the room?', autoShowOnEasy: true },
      { tier: 2, text: 'Look at the globe closely.' },
      { tier: 3, text: 'The numbers scratched on the globe base are the code.' },
    ],
    rewardClue: 'The desk drawer clicks open, revealing a brass key inside.',
  },
  {
    id: 'library-pattern-match',
    roomId: 'library',
    type: 'pattern_match',
    name: 'Color Sequence',
    description: 'Behind the painting is a panel with four colored buttons.',
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
    },
    solution: { type: 'pattern', pattern: ['red', 'blue', 'green', 'yellow'] },
    hints: [
      { tier: 1, text: 'The bookshelf might tell you the order.', autoShowOnEasy: true },
      { tier: 2, text: 'Look at the colored book spines from left to right.' },
      { tier: 3, text: 'Red, Blue, Green, Yellow — that is the order.' },
    ],
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
    },
    solution: { type: 'text', answers: ['book', 'a book', 'books'] },
    hints: [
      { tier: 1, text: 'Look around the room for inspiration.' },
      { tier: 2, text: 'The answer is something found on every shelf here.' },
      { tier: 3, text: 'It is a book.' },
    ],
    rewardClue: 'Inside the cabinet: "Exit code = first digit of pi + vowels in KNOWLEDGE"',
  },
  {
    id: 'library-exit-code',
    roomId: 'library',
    type: 'code_entry',
    name: 'Exit Door Lock',
    description: 'The door to freedom has a 2-digit keypad.',
    data: {
      type: 'code_entry',
      codeLength: 2,
      correctCode: '34',
      clueText: 'Combine clues from the puzzles you have solved.',
    },
    solution: { type: 'code', code: '34' },
    hints: [
      { tier: 1, text: 'Check your journal for clues from solved puzzles.' },
      { tier: 2, text: 'First digit of pi = 3. Count the vowels in KNOWLEDGE.' },
      { tier: 3, text: 'Pi starts with 3. KNOWLEDGE has vowels: O, E, E, so the code is 3 and... wait, also the A? No — K-N-O-W-L-E-D-G-E has O, E, E = 3+... Hmm. The answer is 34. Think about it!' },
    ],
    rewardClue: 'The door swings open! You escaped the library!',
  },
];
