import * as fs from 'fs';

fs.readFile(__filename, () => {
  console.log('io');

  setTimeout(() => {
    console.log('timeout');
    Promise.resolve().then(() => console.log('promise-in-timeout'));
  }, 0);

  setImmediate(() => console.log('immediate'));

  process.nextTick(() => console.log('nextTick'));
  Promise.resolve().then(() => console.log('promise'));
});