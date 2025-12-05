import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("🔌 Connected...");

    // หา User ชื่อ admin
    const user = await User.findOne({ username: 'admin' });
    
    if (!user) {
      console.log("❌ ไม่พบ User ชื่อ admin เลย");
    } else {
      // บังคับแก้ Role เป็น admin
      user.role = 'admin';
      await user.save();
      console.log(`✅ อัปเดต Role ของ ${user.username} เป็น 'admin' เรียบร้อย!`);
    }

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixAdmin();