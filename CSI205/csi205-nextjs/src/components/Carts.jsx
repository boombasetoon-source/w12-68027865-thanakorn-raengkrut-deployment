'use client';

import Link from 'next/link';
import { useApp } from './AppProvider';
import ProductCard, { formatPrice } from './ProductCard';
import styles from './Shop.module.css';

export default function Carts() {
  const { carts, removeFromCart } = useApp();
  const total = carts.reduce((sum, product) => sum + product.price, 0);

  return (
    <>
      <section className={styles.shelf} aria-label="สินค้าในตะกร้า">
        {carts.length === 0 ? (
          <div className={styles.empty}>
            <i className="bi bi-cart3" aria-hidden="true" />
            <p>ยังไม่มีสินค้าในตะกร้า</p>
            <Link href="/products" className="btn btn-sm btn-outline-primary">
              ไปเลือกสินค้า
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {carts.map((product) => (
              <ProductCard key={product.id} product={product}>
                <button
                  type="button"
                  className={`btn btn-sm ${styles.action} ${styles.remove}`}
                  onClick={() => removeFromCart(product.id)}
                >
                  Remove
                </button>
              </ProductCard>
            ))}
          </div>
        )}
      </section>

      <div className={styles.summary}>
        <span className="badge rounded-pill text-bg-warning">
          Count: {carts.length} {carts.length === 1 ? 'item' : 'items'}
        </span>
        <span className="badge rounded-pill text-bg-danger">Price: {formatPrice(total)}</span>
      </div>
    </>
  );
}
