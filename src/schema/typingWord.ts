import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  language: { type: [String], required: false }, // Array of Strings
  category: { type: [String], required: false }
});

export type Word = mongoose.InferSchemaType<typeof wordSchema>;
export const Word = mongoose.model('word', wordSchema);
