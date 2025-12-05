import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketItem extends Document {
  seller: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  contact_info: string;
  createdAt: Date;
}

const MarketItemSchema: Schema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image_url: { type: String, default: "" }, 
  contact_info: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMarketItem>('MarketItem', MarketItemSchema);