'use client';

import { useEffect, useRef, useState } from 'react';
import { useApp } from './AppProvider';
import { EMAIL_DOMAIN } from '@/data/users';

export default function LoginModal() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (!login(username, password)) {
      setError('Username หรือ Password ไม่ถูกต้อง');
      setPassword('');
    }
  }

  return (
    <div className="login-backdrop">
      <form
        className="login-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onSubmit={handleSubmit}
      >
        <h2 id="login-title" className="login-title">
          Who are you?
        </h2>

        <div className="input-group mb-2">
          <span className="input-group-text" aria-hidden="true">
            <i className="bi bi-keyboard" />
          </span>
          <input
            ref={userRef}
            type="text"
            className="form-control"
            placeholder="user | admin | manager"
            aria-label="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
          />
          <span className="input-group-text">{EMAIL_DOMAIN}</span>
        </div>

        <div className="input-group">
          <button
            type="button"
            className="input-group-text login-eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          >
            <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`} />
          </button>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            placeholder="pass"
            aria-label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />
        </div>

        <p className="login-error" role="alert">
          {error}
        </p>

        <div className="text-end">
          <button type="submit" className="btn btn-outline-dark" disabled={!username || !password}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
