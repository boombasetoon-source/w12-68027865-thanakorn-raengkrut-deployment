import styles from './Shop.module.css';

const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatPrice(value) {
  return price.format(value);
}

// การ์ดสินค้า 1 ใบ ใช้ทั้งหน้า Products และ Carts — ต่างกันแค่ปุ่มด้านล่าง (children)
export default function ProductCard({ product, children }) {
  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        <img src={product.image} alt="" loading="lazy" width="300" height="300" />
        <span className={styles.price}>{formatPrice(product.price)}</span>
        <h3 className={styles.title} title={product.title}>
          <span>{product.title}</span>
        </h3>
      </div>
      {children}
    </article>
  );
}
