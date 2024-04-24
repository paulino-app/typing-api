import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Performance } from './schema/typingPerformance';
import mongoose from 'mongoose';
import { createJson } from './file';
import processWordsFromFile from '../upload';
import { Word } from '@schema/typingWord';

await mongoose.connect(Bun.env.MONGO_URL as string, { dbName: 'typing' });

const app = new Hono();

app.use(cors());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const wordLanguage: any = {
  spanish: './words/spanish.json',
  english: './words/english.json'
};

app.get('/words', async (context) => {
  const { mode, language, amount, preset, characters } = context.req.query();

  console.log(context.req.query());

  const charactersPreset = characters.split(',');
  console.log({ charactersPreset });

  const totalAmount = parseInt(amount);

  let result: any[] = [];
  let amountTrack = totalAmount;

  if (charactersPreset.includes('numbers')) {
    const randomAmount = randomRange(1, 4);
    const randomNumbers = getRandomNumbers(randomAmount);
    amountTrack -= randomAmount;
    result.push(randomNumbers);
  }

  if (charactersPreset.includes('symbols')) {
    const randomAmount = randomRange(1, 5);
    const randomSymbols = getRandomSymbols(randomAmount);
    amountTrack -= randomAmount;
    result.push(randomSymbols);
  }

  if (charactersPreset.includes('letters')) {
    const randomWords = await getRandomWords(amountTrack, language);
    result.push(randomWords);
  }

  result = result.flat();
  result = shuffle(result);

  const words = result;
  const text = result.join(' ');

  return context.json({ words, text }, 200);
});

// console.log(getRandomNumbers());

function getRandomSymbols(amount: number) {
  // const symbols = `&[]{}()=*+-!~^@#|\'"\``;
  const symbols = [
    '&',
    '[',
    ']',
    '{',
    '}',
    '(',
    ')',
    '=',
    '*',
    '+',
    '-',
    '!',
    '?',
    '~',
    '^',
    '@',
    '#',
    '|',
    "'",
    '"',
    '`',
    ';',
    ',',
    '.',
    '%',
    '$'
  ];

  const numbers: any[] = [];
  for (let u: number = 0; u < amount; ++u) {
    const r = randomRange(1, 4);
    const s = [];
    for (let i: number = 0; i < r; ++i) {
      const randomIndex: number = randomRange(0, symbols.length - 1);
      const randomSymbol: string = symbols[randomIndex];
      s.push(randomSymbol);
    }

    numbers.push(s.join(''));
  }
  return numbers;
}

function getRandomNumbers(amount: number): string[] {
  const numbers: string[] = [];
  for (let i: number = 0; i < amount; ++i) {
    const randomNumber: number = randomRange(0, 9999);
    const randomNumberString: string = randomNumber.toString();
    numbers.push(randomNumberString);
  }
  return numbers;
}

async function getRandomWords(amount: number, language: string = 'Spanish') {
  const words = [];
  try {
    const documents = await Word.aggregate([
      { $match: { language: language } }, // Add a $match stage
      { $sample: { size: amount } }
    ]);

    for (const document of documents) {
      const { word } = document;
      words.push(word);
    }
  } catch (error) {
    console.error('Error getting random words:', error);
  } finally {
    return words;
  }
}

app.get('/performance', async (context) => {
  try {
    const document = await Performance.find();
    return context.json(document, 200);
  } catch (error) {
    console.log(error);
    return context.json({ error: error }, 400);
  }
});

app.post('/performance', async (context) => {
  console.log('creting record...');

  const body = await context.req.json();
  try {
    const document = await Performance.create(body);
    return context.json(document, 200);
  } catch (error) {
    console.log(error);
    return context.json({ error: error }, 400);
  }
});

function randomString(words: string[], wordsAmount: number) {
  const randomWords: string[] = [];

  for (let i: number = 0; i < wordsAmount; ++i) {
    const randomIndex = randomRange(0, words.length);
    const randomWord = words[randomIndex];

    randomWords.push(randomWord);
  }

  return randomWords;
}

function shuffle(array: any[]): any[] {
  let result: any[] = [...array];
  for (let i = result.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getWords() {
  const documents = await Word.find().sort({ word: 1 });
  console.log(documents);
}

// getWords();

async function main() {
  const words = await processWordsFromFile(
    './words/spanish1k.json',
    'Spanish',
    '1K'
  );

  for (const word of words) {
    try {
      const document = await Word.create(word);
      console.log(document);
    } catch (error) {
      console.log(error);
    }
  }
}

// main();

export default app;
