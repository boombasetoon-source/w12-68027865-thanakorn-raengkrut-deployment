// บัญชีผู้ใช้สำหรับหน้า Login (ข้อมูลตัวอย่างสำหรับงานวิชา — ไม่ใช่ระบบยืนยันตัวตนจริง)
// พิมพ์ username เป็น user | admin | manager แล้วระบบจะต่อ @company.com ให้เอง

export const EMAIL_DOMAIN = '@company.com';

export const users = [
  { username: 'user', password: 'pass', role: 'user', name: 'น.ส. ใช้งาน ธรรมดา' },
  { username: 'admin', password: 'pass', role: 'admin', name: 'นาย ผู้ดูแล ระบบ' },
  { username: 'manager', password: 'pass', role: 'manager', name: 'นาง ผู้จัดการ ทั่วไป' },
];

export function verifyUser(username, password) {
  const name = username.trim().toLowerCase().replace(EMAIL_DOMAIN, '');
  const found = users.find((u) => u.username === name && u.password === password);
  if (!found) return null;
  const { password: _omit, ...user } = found;
  return { ...user, email: found.username + EMAIL_DOMAIN };
}
