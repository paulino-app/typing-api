import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createJson } from './file';

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
  const { amount, language, type } = context.req.query();

  const wordsAmount = parseInt(amount);
  const path = wordLanguage[language] ?? wordLanguage.english;

  const file = Bun.file(path);
  const words = await file.json();

  const randomWords = randomString(words, wordsAmount);

  return context.json({ words: randomWords, text: randomWords.join(' ') }, 200);
});

// app.get('/words/english/random', async (context) => {
//   const { amount } = context.req.query();

//   const wordsAmount = parseInt(amount);

//   const path = './output2.json';
//   const file = Bun.file(path);
//   const words = await file.json();

//   const randomWords = randomString(words, wordsAmount);

//   return context.json({ words: randomWords, text: randomWords.join(' ') }, 200);
// });

function randomString(words: string[], wordsAmount: number) {
  const randomWords: string[] = [];

  for (let i: number = 0; i < wordsAmount; ++i) {
    const randomIndex = randomRange(0, words.length);
    const randomWord = words[randomIndex];

    randomWords.push(randomWord);
  }

  return randomWords;
}

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// createJson();

export default app;
