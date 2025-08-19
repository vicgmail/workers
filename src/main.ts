import { Worker } from 'node:worker_threads';
import * as path from 'node:path';

// Проверяем, запускаем ли через ts-node
const isTSNode = __filename.endsWith(".ts");

// Путь к воркеру
const workerFile = isTSNode
  ? path.resolve(__dirname, "../worker/worker.ts") // для ts-node
  : path.resolve(__dirname, "../worker/worker.js"); // для скомпилированного JS

const worker = new Worker(workerFile, isTSNode ? { execArgv: ["-r", "ts-node/register"] } : {});

worker.on('message', (result) => {
  console.log('Result:', result);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

worker.on('exit', (code) => {
  if (code !== 0) console.log(`Worker stopped with exit code ${code}`);
});

setInterval(() => {
  console.log('Main IO');
}, 1000);