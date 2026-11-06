import Link from 'next/link';
import { profile } from '@/data/profile';
import styles from './home.module.css';

const PROJECTS = [
  {
    href: '/animation',
    icon: 'bi-dribbble',
    title: 'Animation',
    text: 'ลูกบอลเด้งในสนาม (Vite → Next.js)',
  },
  {
    href: '/calculator',
    icon: 'bi-calculator',
    title: 'Calculator',
    text: 'เครื่องคิดเลข (HTML/CSS/JS → Next.js)',
  },
  {
    href: '/todos',
    icon: 'bi-list-check',
    title: 'Todos',
    text: 'จัดการงาน กรอง และแบ่งหน้า',
  },
  {
    href: '/products',
    icon: 'bi-bag',
    title: 'Products & Carts',
    text: 'เลือกสินค้าใส่ตะกร้า สรุปราคา',
  },
];

export default function HomePage() {
  return (
    <section className={`card ${styles.card}`}>
      <div className="row g-3">
        <div className="col-sm-5">
          <figure className={styles.profile}>
            <img src={profile.photo} alt={`รูปของ ${profile.name}`} />
            <figcaption>
              <strong>{profile.name}</strong>
              {profile.nickname && ` (${profile.nickname})`}
              <br />
              รหัสนักศึกษา {profile.studentId}
              <br />
              {profile.program}
              <br />
              {profile.school}
              <br />
              {profile.university}
            </figcaption>
          </figure>
        </div>

        <div className="col-sm-7">
          <h2 className={styles.greeting}>{profile.greeting} 👋</h2>
          <p className={styles.intro}>{profile.intro}</p>

          <ul className={styles.about}>
            {profile.about.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.text}
              </li>
            ))}
          </ul>

          <p className={styles.sectionTitle}>ผลงานในเว็บนี้</p>
          <div className={styles.projects}>
            {PROJECTS.map((project) => (
              <Link key={project.href} href={project.href} className={styles.project}>
                <i className={`bi ${project.icon}`} aria-hidden="true" />
                <span>
                  <strong>{project.title}</strong>
                  <small>{project.text}</small>
                </span>
              </Link>
            ))}
          </div>

          <img src="/images/coder.svg" alt="" className={styles.illustration} />
        </div>
      </div>
    </section>
  );
}
