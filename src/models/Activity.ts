import mongoose, { Schema, Document } from 'mongoose';

// 1. Define Interface (บอก TypeScript ว่าข้อมูลมีหน้าตาแบบนี้)
export interface IActivity extends Document {
  title: string;          // ชื่อกิจกรรม
  description: string;    // รายละเอียด
  category: string;       // หมวดหมู่ (เช่น สุขภาพ, ธรรมะ)
  date: Date;             // วันจัดกิจกรรม
  location: string;       // สถานที่
  maxParticipants: number;// รับจำนวนจำกัด
  currentParticipants: number; //จำนวนที่รับไปแล้ว
  created_at: Date;
}

// 2. Define Mongoose Schema (บอก MongoDB ว่าจะเก็บข้อมูลแบบนี้)
const ActivitySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['สุขภาพ', 'นันทนาการ', 'ธรรมะ', 'งานฝีมือ', 'อื่นๆ'] // บังคับเลือกแค่ที่มีในนี้
  },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  maxParticipants: { type: Number, default: 20 },
  currentParticipants: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

// 3. Export Model
export default mongoose.model<IActivity>('Activity', ActivitySchema);