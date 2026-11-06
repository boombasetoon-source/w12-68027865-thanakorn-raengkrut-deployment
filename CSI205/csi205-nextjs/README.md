# CSI205 – Front-End Software Development (Next.js)

เว็บรวมงาน: **Home** (แนะนำตัวเอง), **Animation** (ย้ายจาก Vite), **Calculator** (ย้ายจาก HTML/CSS/JS),
**Todos**, **Products** และ **Carts** — ต้อง Login ก่อนใช้งาน
ใช้ Next.js (App Router) + React + Bootstrap 5 + Bootstrap Icons

## วิธีรัน

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## Login

ก่อนเข้าเว็บจะมีกล่อง **Who are you?** ให้ login (บัญชีอยู่ใน `src/data/users.js`)

| username | password | role |
| --- | --- | --- |
| `user` | `pass` | USER |
| `admin` | `pass` | ADMIN |
| `manager` | `pass` | MANAGER |

ระบบต่อ `@company.com` ให้เอง หลัง login จะแสดง ROLE / NAME / EMAIL ใต้หัวเว็บ และมีปุ่ม Logout
สถานะ login และของในตะกร้าเก็บใน `localStorage` (รีเฟรชแล้วไม่หาย)
*(เป็นระบบจำลองสำหรับงานวิชา ไม่ใช่ระบบยืนยันตัวตนจริง)*

## แก้ข้อมูลส่วนตัว

แก้ไฟล์ `src/data/profile.js` ไฟล์เดียว (ชื่อ รหัสนักศึกษา ข้อความแนะนำตัว ลิงก์ Facebook/YouTube)
ข้อมูลจะไปแสดงทั้งหน้า Home และ footer ทุกหน้า

รูปโปรไฟล์: วางรูปของคุณใน `public/images/` (เช่น `me.jpg`) แล้วเปลี่ยน `photo: '/images/me.jpg'`
รูปนี้ใช้เป็นลูกบอลแบบ **Human** ในหน้า Animation ด้วย

## โครงสร้าง

```
src/
  app/
    layout.jsx            หัวเว็บ + เมนู + footer (ใช้ร่วมกันทุกหน้า)
    page.jsx              หน้า Home
    animation/page.jsx    หน้า Animation
    calculator/page.jsx   หน้า Calculator
    todos/page.jsx        หน้า Todos
    products/page.jsx     หน้า Products
    carts/page.jsx        หน้า Carts
  components/
    AppHeader.jsx         ตัวอักษร CSI205 + ชื่อวิชา
    AppNavbar.jsx         ปุ่มเมนู (ไฮไลต์หน้าปัจจุบัน)
    AppFooter.jsx         รหัส ชื่อ และไอคอนโซเชียล
    Animation.jsx         ลูกบอลเด้งในสนาม
    Calculator.jsx        เครื่องคิดเลข (useReducer)
    AppProvider.jsx       Context กลาง: user, ตะกร้า, todos (useApp)
    AppShell.jsx          เบลอหน้าเว็บ + แสดง LoginModal เมื่อยังไม่ login
    LoginModal.jsx        กล่อง Who are you?
    UserBar.jsx           ROLE / NAME / EMAIL
    Todos.jsx             ตาราง todo: เพิ่ม ลบ สลับสถานะ กรอง แบ่งหน้า
    Products.jsx          การ์ดสินค้า + ปุ่ม Add to Carts
    Carts.jsx             สินค้าในตะกร้า + ปุ่ม Remove + สรุปจำนวน/ราคา
    ProductCard.jsx       การ์ดสินค้า (ใช้ร่วมกัน)
  data/
    profile.js            ข้อมูลส่วนตัว
    users.js              บัญชีสำหรับ login
    products.js todos.js  ข้อมูลตัวอย่าง (สุ่มแบบ seed ได้ผลเดิมทุกครั้ง)
public/images/            รูปสนาม ลูกบอล โลโก้ และรูปโปรไฟล์
```

## สิ่งที่เปลี่ยนตอนย้ายมา Next.js

- **Animation**: ส่วนที่ใช้ state/effect/event เป็น Client Component (`'use client'`) ส่วน `page.jsx` เป็น Server Component ที่กำหนด `metadata`
  ขยับลูกบอลด้วย `requestAnimationFrame` และคิดตำแหน่งเป็น % ทำให้สนามย่อขยายตามจอได้
- **Calculator**: แทนการแก้ DOM ตรง ๆ (`document.getElementById`, ตัวแปร global) แบบ HTML/CSS/JS ด้วย `useReducer`
  เก็บสถานะทั้งหมดไว้ในที่เดียว ปุ่มสร้างจาก array และรองรับคีย์บอร์ด

## คีย์ลัด

- Animation: `Space` = Run/Pause, `0`–`6` = เปลี่ยนลูกบอล
- Calculator: `0`–`9` `.` `+` `-` `*` `/` `%` `Enter` `Backspace` `Esc`
