
// CPU-intensive задача
let sum = 0;
for (let i = 0; i < 1e9; i++) {
  sum += i;
}

// Отправляем результат родительскому процессу
if (process.send) {
  process.send(sum);
}