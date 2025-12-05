import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  activity: mongoose.Types.ObjectId;
  text: string;
  isDeleted: boolean;
  isEdited: boolean; // <--- เพิ่มตัวนี้
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  activity: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
  text: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false }, // <--- Default เป็น false
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', CommentSchema);