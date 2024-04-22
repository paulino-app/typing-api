import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
  settings: {
    mode: { type: String, required: true },
    language: { type: String, required: true },
    amount: { type: Number, required: true },
    preset: { type: String, required: true },
    characters: [{ type: String, required: true }]
  },
  layout: { type: String, required: true },
  keyboard: { type: String, required: true },
  durationMs: { type: Number, required: true },
  wordsPerMinute: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  characterGroups: [{ type: String, required: true }],
  totalCharacters: { type: Number, required: true },
  correctCharacterGroups: [{ type: String, required: true }],
  correctedCharacterGroups: [{ type: String, required: false }],
  incorrectCharacterGroups: [{ type: String, required: true }],
  typos: {
    type: Map,
    of: Number,
    required: true
  }
});

export type Performance = mongoose.InferSchemaType<typeof performanceSchema>;
export const Performance = mongoose.model('performance', performanceSchema);
