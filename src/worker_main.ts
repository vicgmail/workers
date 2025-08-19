import { WorkerPool } from "./worker_pool";
import * as path from "node:path";

// Path for worker file
const isTSNode = __filename.endsWith(".ts");
const workerFile = path.resolve(__dirname, isTSNode ? "worker_child.ts" : "worker_child.js");

(async () => {
  const pool = new WorkerPool(workerFile);

  const tasks = [];
  for (let i = 0; i < 10; i++) {
    tasks.push(pool.run({ id: i, iterations: 1e7 }));
  }

  const results = await Promise.all(tasks);
  console.log("All results:", results);

  pool.destroy();
})();