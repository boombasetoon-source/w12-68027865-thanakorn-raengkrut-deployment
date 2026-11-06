'use client';

import { useApp } from './AppProvider';
import ProductCard from './ProductCard';
import styles from './Shop.module.css';

export default function Products() {
  const { products, cartIds, addToCart } = useApp();

  return (
    <section className={styles.shelf} aria-label="สินค้าทั้งหมด">
      <div className={styles.grid}>
        {products.map((product) => {
          const inCart = cartIds.includes(product.id);
          return (
            <ProductCard key={product.id} product={product}>
              <button
                type="button"
                className={`btn btn-sm ${styles.action} ${inCart ? styles.added : styles.add}`}
                onClick={() => addToCart(product.id)}
                disabled={inCart}
              >
                {inCart ? (
                  <>
                    <i className="bi bi-check2" aria-hidden="true" /> In Carts
                  </>
                ) : (
                  'Add to Carts'
                )}
              </button>
            </ProductCard>
          );
        })}
      </div>
    </section>
  );
}
