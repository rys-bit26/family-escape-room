export interface RoomNarrative {
  introText: string;
  outroText: string;
}

export const CAMPAIGN_INTRO =
  'Your family has been locked inside a mysterious building with four enchanted rooms. ' +
  'Each room holds puzzles that guard the path forward. Work together, solve every challenge, ' +
  'and escape before time runs out!';

export const CAMPAIGN_VICTORY =
  'You did it! Every room conquered, every puzzle solved. ' +
  'The front doors swing wide open and sunlight pours in. ' +
  'Your family steps out together, champions of the Escape Room. ' +
  'What an adventure — you make a pretty great team.';

export const ROOM_NARRATIVES: Record<string, RoomNarrative> = {
  library: {
    introText:
      'You find yourselves in a dusty old library. The door slams shut behind you. ' +
      'Ancient books line the walls, and something glints on the desk...',
    outroText:
      'You escaped the library! The next door creaks open, revealing flashing neon lights. ' +
      'The arcade awaits...',
  },
  arcade: {
    introText:
      'Neon lights buzz to life around you. Retro arcade machines hum and blink. ' +
      'The tokens are scattered, and the exit gate is locked tight.',
    outroText:
      'You conquered the arcade! Beyond the exit gate, you hear the faint sound of music. ' +
      'An old concert hall beckons...',
  },
  'concert-hall': {
    introText:
      'A grand but abandoned concert hall stretches before you. Dust motes dance in the spotlight. ' +
      'The stage door is sealed — only a true performer can earn their way out.',
    outroText:
      'You took your final bow and escaped the concert hall! ' +
      'Through the stage door, you see stars — not applause, but actual stars. ' +
      'A space station corridor stretches ahead...',
  },
  'space-station': {
    introText:
      'An alarm blares. You are aboard a space station orbiting Earth. ' +
      'The escape pod is locked down. Solve the station\'s puzzles before it\'s too late!',
    outroText:
      'The escape pod launches! Through the window, Earth grows larger as you descend safely home.',
  },
};
