import type { PuzzleDefinition } from '../../types/puzzle.ts';

export const arcadePuzzles: PuzzleDefinition[] = [
  {
    id: 'arcade-high-score',
    roomId: 'arcade',
    type: 'code_entry',
    name: 'High Score Board',
    description: 'The high score board on the old machine is blinking. Enter the legendary score to unlock it.',
    data: {
      type: 'code_entry',
      codeLength: 4,
      correctCode: '1337',
      clueText: 'The champion score is scrawled on a sticky note on the machine...',
    },
    difficultyOverrides: {
      easy: {
        type: 'code_entry',
        codeLength: 4,
        correctCode: '1337',
        clueText: 'Check the sticky note on the machine! It says "LEET" which gamers write as numbers.',
      },
      hard: {
        type: 'code_entry',
        codeLength: 6,
        correctCode: '133742',
        clueText: 'Legends whisper of a score beyond the leaderboard. What do gamers call the ultimate?',
      },
    },
    solution: { type: 'code', code: '1337' },
    hints: [
      { tier: 1, text: 'Look at the arcade machine carefully.', autoShowOnEasy: true },
      { tier: 2, text: 'LEET speak replaces letters with numbers.' },
      { tier: 3, text: 'L=1, E=3, E=3, T=7 -> 1337' },
    ],
    maxAttempts: { easy: 0, medium: 8, hard: 5 },
    rewardClue: 'The machine spits out a token! "PLAYER 2 - INSERT AT JUKEBOX"',
    rewardItemId: 'arcade-token',
  },
  {
    id: 'arcade-light-pattern',
    roomId: 'arcade',
    type: 'pattern_match',
    name: 'Dance Pad Lights',
    description: 'The dance pad on the floor is glowing. Match the light sequence to proceed!',
    data: {
      type: 'pattern_match',
      symbols: ['red', 'blue', 'green', 'yellow', 'purple'],
      gridSize: 4,
      correctPattern: ['green', 'red', 'blue', 'yellow'],
    },
    difficultyOverrides: {
      easy: {
        type: 'pattern_match',
        symbols: ['red', 'blue', 'green', 'yellow'],
        gridSize: 4,
        correctPattern: ['green', 'red', 'blue', 'yellow'],
      },
      hard: {
        type: 'pattern_match',
        symbols: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
        gridSize: 6,
        correctPattern: ['green', 'red', 'blue', 'yellow', 'purple', 'green'],
      },
    },
    solution: { type: 'pattern', pattern: ['green', 'red', 'blue', 'yellow'] },
    hints: [
      { tier: 1, text: 'The poster on the wall shows the dance moves.', autoShowOnEasy: true },
      { tier: 2, text: 'The arrows on the poster point: Up, Left, Right, Down. Match them to colors.' },
      { tier: 3, text: 'Green (up), Red (left), Blue (right), Yellow (down).' },
    ],
    maxAttempts: { easy: 0, medium: 6, hard: 4 },
    rewardClue: 'A hidden compartment opens under the dance pad revealing a note: "The answer is GAME OVER"',
  },
  {
    id: 'arcade-riddle',
    roomId: 'arcade',
    type: 'riddle',
    name: 'The Claw Machine',
    description: 'A riddle scrolls across the claw machine screen.',
    data: {
      type: 'riddle',
      riddleText: 'I have many keys but open no locks.\nI have space but no room.\nYou can enter but you cannot go inside.\nWhat am I?',
      acceptableAnswers: ['keyboard', 'a keyboard', 'computer keyboard'],
    },
    difficultyOverrides: {
      easy: {
        type: 'riddle',
        riddleText: 'I have many keys but open no locks.\nI have space but no room.\nYou can enter but you cannot go inside.\nWhat am I?\n\n(Hint: Gamers use me every day!)',
        acceptableAnswers: ['keyboard', 'a keyboard', 'computer keyboard'],
      },
      hard: {
        type: 'riddle',
        riddleText: 'I speak without a voice,\nI listen but have no ears,\nI hold a world inside me\nBut have no walls or stairs.\nPress my bones and I respond,\nYet I am not alive.\nWhat am I?',
        acceptableAnswers: ['keyboard', 'a keyboard', 'computer keyboard', 'computer', 'a computer'],
      },
    },
    solution: { type: 'text', answers: ['keyboard', 'a keyboard', 'computer keyboard'] },
    hints: [
      { tier: 1, text: 'Think about what every arcade game uses for input.' },
      { tier: 2, text: 'Keys, space bar, enter key... all on one device.' },
      { tier: 3, text: 'It is a keyboard.' },
    ],
    maxAttempts: { easy: 0, medium: 5, hard: 3 },
    rewardClue: 'The claw grabs a prize: "EXIT CODE = lives x continues" (3 lives, 2 continues)',
  },
  {
    id: 'arcade-exit',
    roomId: 'arcade',
    type: 'code_entry',
    name: 'Exit Gate',
    description: 'The arcade exit gate has a keypad. Enter the code to leave.',
    data: {
      type: 'code_entry',
      codeLength: 1,
      correctCode: '6',
      clueText: 'Combine the clues from the machines you have beaten.',
    },
    difficultyOverrides: {
      easy: {
        type: 'code_entry',
        codeLength: 1,
        correctCode: '6',
        clueText: '3 lives x 2 continues = ?',
      },
      hard: {
        type: 'code_entry',
        codeLength: 4,
        correctCode: '6042',
        clueText: 'The gate demands the product of lives and continues, followed by GAME in numbers (A=1, B=2...).',
      },
    },
    solution: { type: 'code', code: '6' },
    hints: [
      { tier: 1, text: 'Check your journal for clues from solved machines.' },
      { tier: 2, text: '3 lives times 2 continues.' },
      { tier: 3, text: '3 x 2 = 6. The code is 6.' },
    ],
    maxAttempts: { easy: 0, medium: 6, hard: 4 },
    rewardClue: 'The gate swings open! You escaped the arcade!',
  },
];
