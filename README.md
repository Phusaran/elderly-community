# 👴👵 Elderly Community Platform (Backend API)

โปรเจกต์ Backend สำหรับระบบปฏิทินและกิจกรรมชุมชนผู้สูงอายุ พัฒนาด้วย **Node.js**, **Express**, **TypeScript** และ **MongoDB**

## 🚀 ฟีเจอร์หลัก (Key Features)

### 👤 สำหรับสมาชิก (User)
- **Authentication:** ระบบสมัครสมาชิก และเข้าสู่ระบบ (มีความปลอดภัยด้วย JWT)
- **Activity Booking:** ดูปฏิทินกิจกรรม, กดลงทะเบียนเข้าร่วม, และยกเลิกการจองได้
- **Smart Calendar:** ปฏิทินส่วนตัว แสดงวันหยุดราชการไทยและกิจกรรมที่จองไว้
- **Marketplace:** ตลาดนัดชุมชน ลงขายสินค้า, แก้ไข, และลบประกาศของตัวเองได้
- **Social & Comments:** แสดงความคิดเห็นใต้กิจกรรม พร้อมระบบ **กรองคำหยาบ (Bad Word Filter)** และแสดงสถานะการแก้ไขข้อความ
- **User Profile:** แก้ไขข้อมูลส่วนตัว, รูปโปรไฟล์ และเขียนแนะนำตัว (Bio)

### 🛠️ สำหรับผู้ดูแลระบบ (Admin)
- **Admin Dashboard:** หน้าแดชบอร์ดสรุปภาพรวม แยกแท็บจัดการชัดเจน
- **Activity Management:** สร้าง, แก้ไข, ลบ กิจกรรมต่างๆ ในชุมชน
- **User Management:** ดูรายชื่อสมาชิก, แก้ไขสิทธิ์ (Promote Admin), หรือแบนสมาชิก (Delete User)
- **Content Moderation:** สิทธิ์ในการลบสินค้า หรือคอมเมนต์ที่ไม่เหมาะสมได้ทันที

---

## 🛠️ Tech Stack

**Frontend:**
- ⚛️ **React + Vite** (TypeScript)
- 🎨 **Tailwind CSS + DaisyUI** (Theming & UI Components)
- 📅 **React Calendar** (Custom Styled)
- 🔗 **Axios** (API Connection)

**Backend:**
- 🟢 **Node.js + Express** (TypeScript)
- 🗄️ **MongoDB (Atlas)** + Mongoose
- 🔐 **JWT + Bcrypt** (Authentication & Security)
- 🛡️ **Cors & Dotenv**

---

## ⚙️ วิธีการติดตั้งและรันโปรเจกต์ (Installation)

### 1. Clone และติดตั้ง Library
```bash
# 1. แตกไฟล์ Zip หรือ Clone ลงมา
# 2. ติดตั้ง dependencies (ห้ามลืม!)
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ที่ root folder (ระดับเดียวกับ package.json) และใส่ค่าตามนี้:

```env
PORT=5000

# ⚠️ Link จากเราส่งให้ในไลน์นะ (ที่เป็น mongodb+srv://...)
MONGO_URI=วาง_Link_ที่ได้จากเรา_ตรงนี้

# ใส่ข้อความมั่วๆ ยาวๆ เพื่อเป็นกุญแจเข้ารหัส Token
JWT_SECRET=mysupersecretkey123456
```

### 3. เตรียมข้อมูล (Data Seeding) 🪄
ถ้า Database ยังไม่มีข้อมูล ให้รันคำสั่งนี้เพื่อสร้าง Admin และกิจกรรมตัวอย่าง:

```bash
# สร้าง Admin (admin / admin1234)
npx ts-node src/createAdmin.ts

# เสกกิจกรรม 40 รายการ
npx ts-node src/seed.ts
```

### 4. รัน Server 🚀
```bash
npm run dev
```
Server จะรันที่: `http://localhost:5000`

---

## 📡 API Documentation (คู่มือการใช้งาน API)

### 🔐 1. Authentication (ระบบสมาชิก)

| Method | Endpoint | Description | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | สมัครสมาชิก (User) | `{ "username": "...", "password": "...", "phone": "..." }` |
| `POST` | `/api/login` | เข้าสู่ระบบ (ได้ Token) | `{ "username": "...", "password": "..." }` |

> **⚠️ สำคัญ:** เมื่อ Login สำเร็จ จะได้ `token` กลับมา ให้ Frontend เก็บ Token นี้ไว้ และส่งมาใน Header ทุกครั้งที่เรียก API ที่ต้องล็อกอิน (Booking / Admin Actions)
> **Header Format:** `Authorization: Bearer <token_here>`

### 📅 2. Activities (กิจกรรม)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/activities` | Public | ดึงรายการกิจกรรมทั้งหมด (40 รายการ) |
| `GET` | `/api/activities/:id` | Public | ดูรายละเอียดกิจกรรมตาม ID |
| `POST` | `/api/activities` | **Admin** 🔒 | สร้างกิจกรรมใหม่ |
| `PUT` | `/api/activities/:id` | **Admin** 🔒 | แก้ไขกิจกรรม |
| `DELETE` | `/api/activities/:id` | **Admin** 🔒 | ลบกิจกรรม |

**ตัวอย่าง JSON สำหรับสร้าง/แก้ไขกิจกรรม:**
```json
{
  "title": "รำไทเก๊กยามเช้า",
  "description": "บริหารร่างกายเพื่อสุขภาพ...",
  "category": "สุขภาพ",
  "date": "2025-12-01",
  "location": "สวนสาธารณะ",
  "maxParticipants": 30
}
```

### 🎫 3. Booking (ระบบจอง)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/activities/:id/join` | **User** 🔒 | กดจองเข้าร่วมกิจกรรม (เช็คที่ว่าง + จองซ้ำอัตโนมัติ) |
| `GET` | `/api/my-bookings` | **User** 🔒 | ดูประวัติกิจกรรมที่ฉันเคยจองไว้ |

---

## 📂 โครงสร้างโปรเจกต์
```text
src/
├── config/         # connectDB logic
├── models/         # Database Schema (Activity, User, Booking)
├── middleware/     # Auth logic (Check Token)
├── server.ts       # Main entry point & Routes
├── seed.ts         # Script เสกข้อมูลกิจกรรม
└── createAdmin.ts  # Script สร้าง Admin
```

## ⚠️ หมายเหตุสำหรับทุกคน
* **อย่าลืมสร้างไฟล์ `.env`** ก่อนรัน ไม่งั้นต่อ Database ไม่ติด
* ถ้าจะเทสหน้าเว็บ ให้ Login เอา Token ก่อนเสมอ
* **Admin Account:** `admin` / `admin1234`