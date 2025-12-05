import mongoose, { Schema, Document } from 'mongoose';

export interface IBadWord extends Document {
  word: string;
}

const BadWordSchema: Schema = new Schema({
  word: { type: String, required: true, unique: true }
});

export default mongoose.model<IBadWord>('BadWord', BadWordSchema);