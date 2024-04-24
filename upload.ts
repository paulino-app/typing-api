import { Word } from '@schema/typingWord';
import fs from 'fs';

interface WordObject {
  word: string;
  language: string;
  category: string;
}

async function processWordsFromFile(
  dataFilePath: string,
  language: string,
  category: string
): Promise<WordObject[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const wordsData = JSON.parse(data);
          const wordObjects: WordObject[] = wordsData.words.map(
            (word: any) => ({
              word: word,
              language: [language],
              category: [category]
            })
          );
          resolve(wordObjects);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
}

export default processWordsFromFile;
