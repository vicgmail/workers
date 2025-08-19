import { fork } from 'child_process';
import * as path from 'node:path';

// Проверяем, запускаем ли через ts-node
const isTSNode = __filename.endsWith('.ts');

// Путь к воркеру
const workerFile = isTSNode
  ? path.resolve(__dirname, '../worker/worker.ts') // для ts-node
  : path.resolve(__dirname, '../worker/worker.js'); // для скомпилированного JS

// Опции для ts-node
const forkOptions = isTSNode
  ? { execArgv: ['-r', 'ts-node/register'] }
  : {};

// Создаём child process
const child = fork(workerFile, [], forkOptions);

// Слушаем сообщения от воркера
child.on('message', (result) => {
  console.log('Result:', result);
});

// Обработка ошибок
child.on('error', (err) => {
  console.error('Child process error:', err);
});

// Выход процесса
child.on('exit', (code) => {
  if (code !== 0) console.log(`Child process exited with code ${code}`);
});

// Основной поток остаётся отзывчивым
setInterval(() => {
  console.log('Main IO');
}, 1000);