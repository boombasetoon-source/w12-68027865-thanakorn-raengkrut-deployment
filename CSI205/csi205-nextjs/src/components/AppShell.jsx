'use client';

import { useApp } from './AppProvider';
import LoginModal from './LoginModal';

// ถ้ายังไม่ login: เนื้อหาทั้งหน้าถูกเบลอ/ปิดการใช้งาน และแสดงกล่อง Login ทับไว้
export default function AppShell({ children }) {
  const { ready, user } = useApp();
  const locked = !user;

  return (
    <>
      <div className={`app-frame ${locked ? 'is-locked' : ''}`} inert={locked || undefined}>
        {children}
      </div>
      {ready && locked && <LoginModal />}
    </>
  );
}
