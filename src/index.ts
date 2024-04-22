import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Performance } from './schema/typingPerformance';
import mongoose from 'mongoose';

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

  const wordsAmount = parseInt(amount);
  const path = wordLanguage[language] ?? wordLanguage.english;

  const file = Bun.file(path);
  const words = await file.json();

  const randomWords = randomString(words, wordsAmount);

  return context.json({ words: randomWords, text: randomWords.join(' ') }, 200);
});

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

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// createJson();

export default app;
