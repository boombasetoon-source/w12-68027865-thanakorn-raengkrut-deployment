// ข้อมูลส่วนตัว — แก้ไฟล์นี้ไฟล์เดียว แล้วทุกหน้าจะเปลี่ยนตาม
// (รูปโปรไฟล์: วางไฟล์รูปของคุณไว้ใน public/images แล้วเปลี่ยน photo ให้ชี้ไปที่ไฟล์นั้น)

export const profile = {
  studentId: '68027865',
  name: 'ธนากร แรงครุฑ',
  nickname: '', // ใส่ชื่อเล่นได้ ถ้าเว้นว่างจะไม่แสดง
  photo: '/images/profile.jpg',

  program: 'สาขาวิชาวิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์',
  school: 'School of Information Technology (SIT)',
  university: 'Sripatum University (SPU)',

  intro:
    'เป็นนักศึกษาสาขาวิชาวิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์ ที่ชอบสร้างเว็บไซต์ให้สวยงามและใช้งานง่าย กำลังเรียนวิชา CSI205 Front-End Software Development เพื่อพัฒนาทักษะการเขียนเว็บด้วย React และ Next.js',

  about: [
    { label: 'ความสนใจ', text: 'การออกแบบ UX/UI และการทำเว็บที่ตอบสนองได้ทุกขนาดหน้าจอ' },
    { label: 'ทักษะ', text: 'HTML, CSS, JavaScript, Bootstrap, React, Next.js และ Git' },
    { label: 'งานอดิเรก', text: 'เล่นเกม ฟังเพลง และลองทำโปรเจกต์เล็ก ๆ ในเวลาว่าง' },
    { label: 'เป้าหมายสายงาน', text: 'เป็นผู้พัฒนาซอฟต์แวร์ (Software Developer)' },
  ],

  links: {
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
  },
};
