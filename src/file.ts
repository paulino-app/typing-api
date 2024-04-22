import { write } from 'bun';

export async function createJson() {
  const path: string = './en1.txt';
  const file = Bun.file(path);
  const text = await file.text();

  const words = text.split(/\r?\n/);
  words.sort();
  // console.log(words);
  // const wordsWithSymbols = findWordsWithNonAlphanumeric(words);
  // console.log(wordsWithSymbols); // Output: ['world!', 'good#day']

  // console.log(11, findRepeatedWords(words));
  const jsonData: string = JSON.stringify(words, null, 2);

  // console.log(jsonData);

  // Write the JSON data to a file
  write('output2.json', jsonData)
    .then(() => {
      console.log('File has been written successfully.');
    })
    .catch((error) => {
      console.error('Error writing file:', error);
    });
}

function findRepeatedWords(words: string[]): string[] {
  const wordCount: Record<string, number> = {};
  const repeatedWords: string[] = [];

  // Count occurrences of each word
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Find words that occur more than once
  for (const [word, count] of Object.entries(wordCount)) {
    if (count > 1) {
      repeatedWords.push(word);
    }
  }

  return repeatedWords;
}

function findWordsWithNonAlphanumeric(words: string[]): string[] {
  const nonAlphanumericWords: any = [];
  // Regular expression to match characters that are not letters, specific special characters, or numbers
  const regex = /[^a-zA-Z0-9áóéúíñ]/;

  // Check each word for non-alphanumeric characters, excluding specific accented letters
  words.forEach((word, index) => {
    if (regex.test(word)) {
      nonAlphanumericWords.push([word, index]);
    }
  });

  return nonAlphanumericWords;
}

// createJson();
