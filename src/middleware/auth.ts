import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Import User Model มาด้วย

// ขยาย Type ของ Request ให้รู้จัก user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. ดึง Token ออกมา
      token = req.headers.authorization.split(' ')[1];

      // 2. ตรวจสอบความถูกต้องของ Token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // 3. 🔥 จุดสำคัญ: เอา ID ไปดึงข้อมูล User ตัวจริงจาก Database (จะได้รู้ Role ล่าสุด)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // ผ่านไปได้
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};