# Carbon Sequestration Frontend 🎨

ส่วนหน้าเว็บสำหรับแสดงผลและจัดการข้อมูลการกักเก็บคาร์บอน พัฒนาด้วย **Next.js 15+** และ **Tailwind CSS 4**

## ✨ คุณสมบัติหลัก (Key Features)

- **Interactive Map**: แสดงตำแหน่งของต้นไม้ที่บันทึกไว้ด้วย Leaflet
- **Data Visualization**: แดชบอร์ดสรุปผลด้วยกราฟจาก Recharts
- **Tree Calculation Form**: ระบบคำนวณและบันทึกข้อมูลต้นไม้ใหม่
- **Dynamic Animations**: ประสบการณ์ผู้ใช้ที่ลื่นไหลด้วย Framer Motion
- **Modern UI**: ออกแบบด้วยสไตล์ที่ทันสมัย ใช้ Lucide React สำหรับไอคอน

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Next.js 15 (App Router)**: เฟรมเวิร์ก React ที่มีประสิทธิภาพสูง
- **Tailwind CSS 4**: สำหรับการตกแต่งสไตล์ที่รวดเร็วและทันสมัย
- **Leaflet & React-Leaflet**: สำหรับจัดการระบบแผนที่
- **Recharts**: สำหรับการสร้างกราฟแสดงข้อมูล
- **Framer Motion**: สำหรับการทำ Micro-animations

## ⚙️ การตั้งค่าและการรัน (Local Setup)

1. **ติดตั้ง Dependencies**:
   ```bash
   npm install
   ```
2. **ตั้งค่า Environment Variables**:
   สร้างไฟล์ `.env.local` และกำหนดค่า API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. **รัน Frontend (Dev Mode)**:
   ```bash
   npm run dev
   ```

---
Developed with ✨ by Next.js Developers.
