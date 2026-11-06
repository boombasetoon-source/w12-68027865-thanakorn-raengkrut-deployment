import { profile } from '@/data/profile';
import styles from './home.module.css';

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
          <p className={styles.intro}>{profile.intro}</p>

          <ul className={styles.about}>
            {profile.about.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.text}
              </li>
            ))}
          </ul>

          <img src="/images/coder.svg" alt="" className={styles.illustration} />
        </div>
      </div>
    </section>
  );
}
