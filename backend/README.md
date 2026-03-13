# Carbon Sequestration Backend 🚀

ส่วนของ API และระบบคำนวณปริมาณการกักเก็บคาร์บอน พัฒนาด้วย **FastAPI** และเชื่อมต่อกับ **Supabase**

## ✨ คุณสมบัติหลัก (Key Features)

- **Carbon Calculation**: คำนวณปริมาณการกักเก็บคาร์บอนโดยใช้สูตรสำหรับไม้โกงกาง (Mangrove Forest formula)
- **Supabase Integration**: จัดเก็บข้อมูลลงในฐานข้อมูล Supabase โดยตรง
- **Bulk Upload**: รองรับการอัปโหลดข้อมูลจำนวนมากผ่านไฟล์ Excel (.xlsx) หรือ CSV
- **Excel Template**: ระบบสร้างไฟล์ Template สำหรับดาวน์โหลดไปกรอกข้อมูล

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **FastAPI**: สถาปัตยกรรม API ที่รวดเร็วและทันสมัย
- **Supabase**: Backend-as-a-Service สำหรับฐานข้อมูล
- **Pandas & Openpyxl**: สำหรับจัดการไฟล์ Excel และข้อมูลขนาดใหญ่
- **Pydantic**: สำหรับการตรวจสอบความถูกต้องของข้อมูล (Data Validation)

## ⚙️ การตั้งค่าและการรัน (Local Setup)

1. **สร้าง Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. **ติดตั้ง Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **ตั้งค่า Environment Variables**:
   สร้างไฟล์ `.env` และกำหนดค่าดังนี้:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   CARBON_CREDIT_PRICE_PER_TON=175.0
   ```
4. **รัน Backend**:
   ```bash
   uvicorn main:app --reload
   ```

## 📖 API Documentation

เมื่อรัน Backend แล้ว สามารถเข้าดู Documentation (Swagger UI) ได้ที่:
[http://localhost:8000/docs](http://localhost:8000/docs)

---
Developed by FastAPI Enthusiasts.
