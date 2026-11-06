'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/profile';
import styles from './Animation.module.css';

// คิดตำแหน่งเป็นพิกเซลของสนามขนาดจริง แล้วแปลงเป็น % ตอนแสดงผล
// สนามจึงย่อ/ขยายตามหน้าจอได้โดยที่การเด้งยังถูกต้อง
const FIELD_WIDTH = 650;
const FIELD_HEIGHT = 400;
const BALL_SIZE = 100;
const MAX_X = FIELD_WIDTH - BALL_SIZE;
const MAX_Y = FIELD_HEIGHT - BALL_SIZE;

const SPEED_X = 220; // px ต่อวินาที
const SPEED_Y = 170;
const SPIN = 240; // องศาต่อวินาที

const BALLS = [
  { id: 'none', label: 'None', image: null },
  { id: 'basketball', label: 'Basketball', image: '/images/basketball.svg' },
  { id: 'football', label: 'Football', image: '/images/football.svg' },
  { id: 'volleyball', label: 'Volleyball', image: '/images/volleyball.svg' },
  { id: 'human', label: 'Human', image: profile.photo },
  { id: 'cartoon', label: 'Cartoon', image: '/images/cartoon.svg' },
  { id: 'logo', label: 'Logo', image: '/images/logo.svg' },
];

export default function Animation() {
  const [running, setRunning] = useState(false);
  const [ballId, setBallId] = useState('none');
  const [ball, setBall] = useState({ x: 0, y: 0, angle: 0 });

  // ค่าที่เปลี่ยนทุกเฟรมเก็บใน ref เพื่อไม่ให้ต้องพึ่ง state เก่าใน loop
  const motion = useRef({ x: 0, y: 0, angle: 0, goRight: true, goDown: true });

  useEffect(() => {
    if (!running) return;

    let frameId;
    let last = performance.now();

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const m = motion.current;
      m.x += (m.goRight ? SPEED_X : -SPEED_X) * dt;
      m.y += (m.goDown ? SPEED_Y : -SPEED_Y) * dt;

      if (m.x >= MAX_X) {
        m.x = MAX_X;
        m.goRight = false;
      } else if (m.x <= 0) {
        m.x = 0;
        m.goRight = true;
      }

      if (m.y >= MAX_Y) {
        m.y = MAX_Y;
        m.goDown = false;
      } else if (m.y <= 0) {
        m.y = 0;
        m.goDown = true;
      }

      m.angle += (m.goRight ? SPIN : -SPIN) * dt;

      setBall({ x: m.x, y: m.y, angle: m.angle });
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [running]);

  // คีย์ลัด: Space = Run/Pause, 0-6 = เปลี่ยนลูกบอล
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.closest?.('input, textarea, select')) return;

      if (e.code === 'Space') {
        // ปุ่มที่ถูกโฟกัสด้วยคีย์บอร์ดให้ทำงานตามปกติ
        if (e.target.closest?.('button, a')) return;
        e.preventDefault();
        setRunning((r) => !r);
        return;
      }

      const index = '0123456'.indexOf(e.key);
      if (e.key.length === 1 && index !== -1) setBallId(BALLS[index].id);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const current = BALLS.find((b) => b.id === ballId);

  return (
    <section className={styles.wrapper}>
      <div
        className={styles.field}
        style={{ backgroundImage: 'url(/images/field.svg)' }}
        role="img"
        aria-label={`สนาม: ลูกบอลแบบ ${current.label} ${running ? 'กำลังเด้ง' : 'หยุดอยู่'}`}
      >
        <div
          className={styles.ballShadow}
          style={{
            left: `${(ball.x / FIELD_WIDTH) * 100}%`,
            top: `${(ball.y / FIELD_HEIGHT) * 100}%`,
            width: `${(BALL_SIZE / FIELD_WIDTH) * 100}%`,
          }}
        >
          <div
            className={`${styles.ball} ${current.image ? '' : styles.plain}`}
            style={{
              transform: `rotate(${ball.angle}deg)`,
              backgroundImage: current.image ? `url(${current.image})` : undefined,
            }}
          />
        </div>
      </div>

      {/* กันไม่ให้ปุ่มแย่งโฟกัสเมื่อคลิกด้วยเมาส์ เพื่อให้ Space ยังใช้ Run/Pause ได้ */}
      <div className={styles.controls} onMouseDown={(e) => e.preventDefault()}>
        <button
          type="button"
          className={`btn btn-sm ${running ? 'btn-danger' : 'btn-success'} ${styles.runButton}`}
          onClick={() => setRunning((r) => !r)}
        >
          <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'}`} aria-hidden="true" />{' '}
          {running ? 'PAUSE' : 'RUN'}
        </button>

        <div className={styles.ballButtons} role="group" aria-label="เลือกลูกบอล">
          {BALLS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={`btn btn-sm ${b.id === ballId ? 'btn-primary' : 'btn-tab'}`}
              aria-pressed={b.id === ballId}
              title={`คีย์ลัด: ${i}`}
              onClick={() => setBallId(b.id)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.hint}>
        คีย์ลัด: <kbd>Space</kbd> Run/Pause · <kbd>0</kbd>–<kbd>6</kbd> เปลี่ยนลูกบอล
      </p>
    </section>
  );
}
