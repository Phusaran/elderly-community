import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // 'admin' or 'user'
  phone: { type: String },
  
  profile_img: { type: String, default: "" }, // เก็บ URL รูปภาพ
  bio: { type: String, default: "" },         // คำแนะนำตัวสั้นๆ
  joinedAt: { type: Date, default: Date.now } // วันที่สมัครสมาชิก
  // -----------------------
});

export default mongoose.model('User', UserSchema);