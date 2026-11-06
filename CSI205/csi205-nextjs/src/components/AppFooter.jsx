import { profile } from '@/data/profile';

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="student-badge">
        {profile.studentId} {profile.name}
      </div>
      <div className="social">
        <a href={profile.links.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
          <i className="bi bi-facebook" />
        </a>
        <span className="divider" aria-hidden="true" />
        <a href={profile.links.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
          <i className="bi bi-youtube" />
        </a>
      </div>
    </footer>
  );
}
