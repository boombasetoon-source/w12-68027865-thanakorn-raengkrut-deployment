// ตัวช่วยสร้างข้อมูลตัวอย่างแบบ "สุ่มแต่ได้ผลเหมือนเดิมทุกครั้ง" (seeded random)
// ทำให้ server และ browser สร้างข้อมูลชุดเดียวกัน → ไม่เกิด hydration mismatch

export function createRandom(seed) {
  // mulberry32
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora ' +
  'incidunt ut labore et dolore magnam aliquam quaerat voluptatem accusamus iusto odio dignissimos ' +
  'ducimus qui blanditiis praesentium deleniti atque corrupti quos dolores quas molestias excepturi ' +
  'sint occaecati cupiditate provident similique sunt in culpa officia deserunt mollitia animi id ' +
  'est laborum fuga harum quidem rerum facilis expedita distinctio nam libero tempore cum soluta ' +
  'nobis eligendi optio cumque nihil impedit quo minus maxime placeat facere possimus omnis voluptas ' +
  'assumenda repellendus temporibus autem quibusdam officiis debitis aut reiciendis voluptatibus ' +
  'maiores alias perferendis doloribus asperiores repellat natus error beatae vitae dicta explicabo'
).split(' ');

export function sentence(random, min = 3, max = 8) {
  const length = min + Math.floor(random() * (max - min + 1));
  return Array.from({ length }, () => WORDS[Math.floor(random() * WORDS.length)]).join(' ');
}
