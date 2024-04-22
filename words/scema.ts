const typingPerformance = {
  useId: 1,
  date: new Date(),
  settings: {
    mode: 'words',
    language: 'en',
    amount: 25,
    preset: 'random',
    characters: ['letters']
  },
  layout: 'dvorak',
  keyboard: 'vogayer',
  durationMs: 5000,
  wordsPerMinute: 102.4,
  accuracy: 90,
  characterGroups: [
    'The',
    'quick',
    'brown',
    'fox',
    'jumps',
    'over',
    'the',
    'lazy',
    'dog'
  ],
  totalCharacters: 9,
  correctCharacterGroups: ['The', 'quick', 'jumps', 'the', 'dog'],
  correctedCharacterGroups: ['brow', 'fox'],
  incorrectCharacterGroups: ['brown', 'fox', 'over', 'lazy'],
  typos: { o: 3, y: 1, z: 1 }
};
