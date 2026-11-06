'use client';

import { useApp } from './AppProvider';

export default function UserBar() {
  const { user } = useApp();
  if (!user) return null;

  return (
    <dl className="user-bar">
      <div>
        <dt>ROLE:</dt>
        <dd className="user-role">{user.role.toUpperCase()}</dd>
      </div>
      <div>
        <dt>NAME:</dt>
        <dd className="user-name">{user.name}</dd>
      </div>
      <div>
        <dt>EMAIL:</dt>
        <dd className="user-email">{user.email}</dd>
      </div>
    </dl>
  );
}
