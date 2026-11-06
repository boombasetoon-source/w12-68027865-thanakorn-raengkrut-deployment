import { createRandom, sentence } from './seed';

// รายการ Todo ตั้งต้น (โครงเดียวกับ jsonplaceholder.typicode.com/todos)
function generateTodos(count) {
  const random = createRandom(42);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: sentence(random, 3, 7),
    completed: random() < 0.45,
  }));
}

export const initialTodos = generateTodos(40);
