
// CPU-intensive task
import { parentPort } from "node:worker_threads";

if (!parentPort) {
  throw new Error("File must be run as worker thread");
}

parentPort.on("message", (task: { id: number; iterations: number }) => {
  let sum = 0;
  for (let i = 0; i < task.iterations; i++) {
    sum += i;
  }

  parentPort!.postMessage({ id: task.id, result: sum });
});