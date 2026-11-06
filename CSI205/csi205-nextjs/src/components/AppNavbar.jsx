'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from './AppProvider';

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, products, carts, logout } = useApp();

  const tabs = [
    { href: '/', label: 'Home' },
    { href: '/animation', label: 'Animation' },
    { href: '/calculator', label: 'Calculator' },
    { href: '/todos', label: 'Todos' },
    { href: '/products', label: `Products (${products.length})` },
    { href: '/carts', label: 'Carts', badge: carts.length },
  ];

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <nav className="app-nav" aria-label="เมนูหลัก">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`btn position-relative ${active ? 'btn-primary' : 'btn-tab'}`}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {tab.badge}
                <span className="visually-hidden"> รายการในตะกร้า</span>
              </span>
            )}
          </Link>
        );
      })}
      {user && (
        <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}
