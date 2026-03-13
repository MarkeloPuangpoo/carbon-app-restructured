# Carbon Sequestration App 🌳

แอปพลิเคชันสำหรับคำนวณปริมาณการกักเก็บคาร์บอนของต้นไม้ (โดยเฉพาะป่าชายเลน) พร้อมระบบแผนที่และแดชบอร์ดแสดงผล

## 🏗️ โครงสร้างโปรเจกต์ (Project Structure)

โปรเจกต์นี้ถูกแยกส่วนประกอบหลักออกเป็น 2 ส่วน:

- **Frontend**: พัฒนาด้วย Next.js 15+ (React 19) และ Tailwind CSS 4
- **Backend**: พัฒนาด้วย FastAPI (Python) เชื่อมต่อฐานข้อมูล Supabase

## 🚀 วิธีการใช้งาน (Getting Started)

คุณสามารถเริ่มใช้งานโปรเจกต์ทั้งหมดได้อย่างรวดเร็วผ่าน Docker Compose:

### สิ่งที่ต้องเตรียม (Prerequisites)
- [Docker](https://www.docker.com/products/docker-desktop/) และ [Docker Compose](https://docs.docker.com/compose/install/)

### ขั้นตอนการรัน (Run with Docker)
1. **คัดลอกไฟล์ .env**: ตรวจสอบว่ามีไฟล์ `.env` ในโฟลเดอร์ `backend/` และตั้งค่า `SUPABASE_URL` และ `SUPABASE_KEY` ให้เรียบร้อย
2. **รันคำสั่ง**:
   ```bash
   docker-compose up --build
   ```
3. **เข้าใช้งาน**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Documentation (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

## 📁 ส่วนประกอบของโปรเจกต์
- [frontend/](file:///c:/Users/drvvd/Downloads/carbonsomething/carbon-app-restructured/frontend/README.md) - รายละเอียดส่วนหน้าเว็บ
- [backend/](file:///c:/Users/drvvd/Downloads/carbonsomething/carbon-app-restructured/backend/README.md) - รายละเอียดส่วน API และการคำนวณ

---
Made with ❤️ for Carbon Sequestration Tracking.
