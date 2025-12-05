import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  activity: mongoose.Types.ObjectId;
  bookedAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  activity: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
  bookedAt: { type: Date, default: Date.now }
});

// ป้องกันการจองซ้ำ (User 1 คน จอง Activity เดิมได้แค่ครั้งเดียว)
BookingSchema.index({ user: 1, activity: 1 }, { unique: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);