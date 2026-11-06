import { createRandom, sentence } from './seed';

// สินค้าตัวอย่าง: ชื่อแบบ lorem ipsum, ราคาสุ่ม และรูปจาก picsum.photos
const PRODUCT_COUNT = 100;

function generateProducts(count) {
  const random = createRandom(205);
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    return {
      id,
      title: sentence(random, 3, 9),
      price: Math.round((1 + random() * 99) * 100) / 100,
      image: `https://picsum.photos/seed/csi205-${id}/300/300`,
    };
  });
}

export const products = generateProducts(PRODUCT_COUNT);
