import type { PuzzleDefinition } from '../../types/puzzle.ts';

export const concertHallPuzzles: PuzzleDefinition[] = [
  {
    id: 'concert-piano-code',
    roomId: 'concert-hall',
    type: 'code_entry',
    name: 'Piano Lock',
    description: 'The grand piano has a numbered lock on the key cover. Musical notes are scratched into the wood.',
    data: {
      type: 'code_entry',
      codeLength: 4,
      correctCode: '4321',
      clueText: 'The sheet music on the stand shows four notes descending...',
    },
    difficultyOverrides: {
      easy: {
        type: 'code_entry',
        codeLength: 4,
        correctCode: '4321',
        clueText: 'The sheet music shows 4 notes going DOWN: Fa(4), Mi(3), Re(2), Do(1). Enter those numbers!',
      },
      hard: {
        type: 'code_entry',
        codeLength: 6,
        correctCode: '432178',
        clueText: 'A descending melody followed by an ascending leap. Translate notes to their scale positions.',
      },
    },
    solution: { type: 'code', code: '4321' },
    hints: [
      { tier: 1, text: 'Look at the sheet music on the piano stand.', autoShowOnEasy: true },
      { tier: 2, text: 'Do=1, Re=2, Mi=3, Fa=4. The notes are going down.' },
      { tier: 3, text: '4-3-2-1 (Fa-Mi-Re-Do descending).' },
    ],
    maxAttempts: { easy: 0, medium: 8, hard: 5 },
    rewardClue: 'The piano lid opens, revealing a conductor baton inside!',
    rewardItemId: 'conductor-baton',
  },
  {
    id: 'concert-spotlight-pattern',
    roomId: 'concert-hall',
    type: 'pattern_match',
    name: 'Spotlight Sequence',
    description: 'The stage spotlights flash in a pattern. Reproduce the sequence to activate the trapdoor.',
    data: {
      type: 'pattern_match',
      symbols: ['red', 'blue', 'green', 'yellow', 'purple'],
      gridSize: 5,
      correctPattern: ['purple', 'blue', 'red', 'yellow', 'green'],
    },
    difficultyOverrides: {
      easy: {
        type: 'pattern_match',
        symbols: ['red', 'blue', 'green', 'yellow'],
        gridSize: 4,
        correctPattern: ['purple', 'blue', 'red', 'yellow'],
      },
      hard: {
        type: 'pattern_match',
        symbols: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'],
        gridSize: 7,
        correctPattern: ['purple', 'blue', 'red', 'yellow', 'green', 'orange', 'pink'],
      },
    },
    solution: { type: 'pattern', pattern: ['purple', 'blue', 'red', 'yellow', 'green'] },
    hints: [
      { tier: 1, text: 'The colored seats in the audience might be a clue.', autoShowOnEasy: true },
      { tier: 2, text: 'Read the seat colors from the VIP row, left to right.' },
      { tier: 3, text: 'Purple, Blue, Red, Yellow, Green.' },
    ],
    maxAttempts: { easy: 0, medium: 6, hard: 4 },
    rewardClue: 'A trapdoor opens on stage! A note floats up: "The maestro conducts in 3/4 TIME."',
  },
  {
    id: 'concert-riddle',
    roomId: 'concert-hall',
    type: 'riddle',
    name: 'The Velvet Curtain',
    description: 'Behind the curtain, golden letters spell out a riddle on the wall.',
    data: {
      type: 'riddle',
      riddleText: 'I can be loud or soft,\nI travel but have no legs,\nI can be sharp or flat,\nBut I am never dull.\nWhat am I?',
      acceptableAnswers: ['music', 'a note', 'note', 'sound', 'a sound', 'musical note'],
    },
    difficultyOverrides: {
      easy: {
        type: 'riddle',
        riddleText: 'I can be loud or soft,\nI travel but have no legs,\nI can be sharp or flat,\nBut I am never dull.\nWhat am I?\n\n(Hint: You would hear this in a concert hall!)',
        acceptableAnswers: ['music', 'a note', 'note', 'sound', 'a sound', 'musical note'],
      },
      hard: {
        type: 'riddle',
        riddleText: 'Born in silence, I shatter air,\nI bend through walls but am not there.\nI am measured yet never weighed,\nI am composed yet never made.\nSharp or flat, I hold my place,\nFloating through both time and space.\nWhat am I?',
        acceptableAnswers: ['music', 'a note', 'note', 'sound', 'a sound', 'musical note'],
      },
    },
    solution: { type: 'text', answers: ['music', 'a note', 'note', 'sound', 'a sound', 'musical note'] },
    hints: [
      { tier: 1, text: 'Think about what fills a concert hall.' },
      { tier: 2, text: 'Sharp and flat are musical terms.' },
      { tier: 3, text: 'The answer is music (or a note, or sound).' },
    ],
    maxAttempts: { easy: 0, medium: 5, hard: 3 },
    rewardClue: 'The wall slides open! Engraved inside: "EXIT = Time signature numerator x conductor\'s beat count"',
  },
  {
    id: 'concert-exit',
    roomId: 'concert-hall',
    type: 'code_entry',
    name: 'Stage Door',
    description: 'The stage door has a combination lock. Only the right code will let you take your final bow.',
    data: {
      type: 'code_entry',
      codeLength: 1,
      correctCode: '9',
      clueText: 'Combine the clues from your performance: time signature x beat count.',
    },
    difficultyOverrides: {
      easy: {
        type: 'code_entry',
        codeLength: 1,
        correctCode: '9',
        clueText: '3/4 time means the top number is 3. A conductor beats 3 beats. 3 x 3 = ?',
      },
      hard: {
        type: 'code_entry',
        codeLength: 4,
        correctCode: '9440',
        clueText: 'Time times beats, then the tuning frequency of an orchestra...',
      },
    },
    solution: { type: 'code', code: '9' },
    hints: [
      { tier: 1, text: 'Check your journal for all the clues.' },
      { tier: 2, text: '3/4 time: numerator is 3. Conductor beats 3 per measure.' },
      { tier: 3, text: '3 x 3 = 9.' },
    ],
    maxAttempts: { easy: 0, medium: 6, hard: 4 },
    rewardClue: 'The stage door opens to thunderous applause! You escaped the concert hall!',
  },
  {
    id: 'concert-note-sequence',
    roomId: 'concert-hall',
    type: 'hidden_sequence',
    name: 'Musical Scale',
    description: 'Scattered sheet music fragments lie on the stage. Arrange the musical notes in the correct ascending order.',
    data: {
      type: 'hidden_sequence',
      sequence: ['Do', 'Re', 'Mi', 'Fa', 'Sol'],
      scrambledDisplay: ['Mi', 'Sol', 'Do', 'Fa', 'Re'],
    },
    difficultyOverrides: {
      easy: {
        type: 'hidden_sequence',
        sequence: ['Do', 'Re', 'Mi'],
        scrambledDisplay: ['Mi', 'Do', 'Re'],
      },
      hard: {
        type: 'hidden_sequence',
        sequence: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'],
        scrambledDisplay: ['Sol', 'Ti', 'Do', 'La', 'Re', 'Fa', 'Mi'],
      },
    },
    solution: { type: 'sequence', sequence: ['Do', 'Re', 'Mi', 'Fa', 'Sol'] },
    hints: [
      { tier: 1, text: 'Think about the musical scale — it starts low and goes high.', autoShowOnEasy: true },
      { tier: 2, text: 'Do, Re, Mi... what comes next?' },
      { tier: 3, text: 'Do, Re, Mi, Fa, Sol.' },
    ],
    maxAttempts: { easy: 0, medium: 5, hard: 3 },
    rewardClue: 'The notes harmonize and a hidden compartment opens under the stage!',
  },
];
