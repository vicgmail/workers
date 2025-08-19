import { Worker, WorkerOptions } from "node:worker_threads";
import * as os from "node:os";

interface Task {
  id: number;
  iterations: number;
}

interface WorkerTask {
  task?: Task;
  resolve: (value: any) => void;
}

class PooledWorker extends Worker {
  currentTask?: WorkerTask | null = null;

  constructor(path: string, options?: WorkerOptions) {
    super(path, options);
  }
}

const CPU_CORES_AMOUNT = os.cpus().length;
console.log("CPU cores available:", CPU_CORES_AMOUNT);

// WorkerPool class to manage worker threads

export class WorkerPool {
  private size: number;
  private workers: Worker[] = [];
  private freeWorkers: Worker[] = [];
  private queue: WorkerTask[] = [];

  constructor(workerFile: string, size: number = CPU_CORES_AMOUNT) {
    this.size = size;

    const isTSNode = __filename.endsWith(".ts");
    const workerOptions = isTSNode ? { execArgv: ["-r", "ts-node/register"] } : {};

    for (let i = 0; i < this.size; i++) {
      const worker = new PooledWorker(workerFile, workerOptions);

      worker.on("message", (msg) => {
        if (worker["currentTask"]) {
          const { resolve } = worker["currentTask"];
          worker["currentTask"] = null;
          this.freeWorkers.push(worker);
          resolve(msg);

          // если есть задачи в очереди → запускаем
          if (this.queue.length > 0) {
            const next = this.queue.shift()!;
            this.run(next.task!).then(next.resolve);
          }
        }
      });

      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  run<T>(task: Task): Promise<any> {
    return new Promise((resolve) => {
      if (this.freeWorkers.length > 0) {
        const worker: PooledWorker = this.freeWorkers.pop()!;
        worker.currentTask = { resolve };
        worker.postMessage(task);
      } else {
        this.queue.push({ task, resolve });
      }
    });
  }

  destroy() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}