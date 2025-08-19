import { parentPort } from 'node:worker_threads';

if (parentPort) {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {
    sum += i;
  }
  parentPort.postMessage(sum);
}