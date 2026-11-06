'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '@/data/products';
import { initialTodos } from '@/data/todos';
import { verifyUser } from '@/data/users';

const STORAGE_USER = 'csi205.user';
const STORAGE_CARTS = 'csi205.carts';

const AppContext = createContext(null);

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore: private mode หรือ storage ถูกปิด
  }
}

// state กลางของทั้งเว็บ: ผู้ใช้ที่ login, สินค้า, ตะกร้า และ todos
// อยู่ใน layout จึงไม่หายตอนเปลี่ยนหน้า
export default function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [cartIds, setCartIds] = useState([]);
  const [todos, setTodos] = useState(initialTodos);

  // อ่านค่าที่เคยบันทึกไว้หลัง mount (localStorage มีเฉพาะฝั่ง browser)
  useEffect(() => {
    setUser(readStorage(STORAGE_USER));
    const saved = readStorage(STORAGE_CARTS);
    if (Array.isArray(saved)) setCartIds(saved.filter((id) => products.some((p) => p.id === id)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStorage(STORAGE_CARTS, cartIds);
  }, [ready, cartIds]);

  const login = useCallback((username, password) => {
    const found = verifyUser(username, password);
    if (found) {
      setUser(found);
      writeStorage(STORAGE_USER, found);
    }
    return Boolean(found);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    writeStorage(STORAGE_USER, null);
  }, []);

  const addToCart = useCallback(
    (id) => setCartIds((ids) => (ids.includes(id) ? ids : [...ids, id])),
    [],
  );
  const removeFromCart = useCallback((id) => setCartIds((ids) => ids.filter((x) => x !== id)), []);

  const value = useMemo(() => {
    const carts = cartIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
    return {
      ready,
      user,
      login,
      logout,
      products,
      carts,
      cartIds,
      addToCart,
      removeFromCart,
      todos,
      setTodos,
    };
  }, [ready, user, login, logout, cartIds, addToCart, removeFromCart, todos]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside <AppProvider>');
  return context;
}
