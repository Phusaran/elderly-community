import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("🔌 Connected...");

    // 1. ลบ User เก่าทิ้งก่อน (ถ้ามี)
    await User.deleteMany({});

    // 2. เข้ารหัสรหัสผ่าน (Password Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin1234", salt); // <-- รหัสผ่านคือ admin1234

    // 3. สร้าง Admin
    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin Created! (Username: admin / Password: admin1234)");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();