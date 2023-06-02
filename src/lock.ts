import { Mutex } from 'async-mutex';

class AsyncLock {
  private readonly locks: Map<string, Mutex>;

  public constructor() {
    this.locks = new Map();
  }

  public acquire(resource: string): Promise<void> {
    let lock = this.locks.get(resource);

    if (!lock) {
      lock = new Mutex();
      //lock = new Promise(resolve => resolve());
      this.locks.set(resource, lock);
    }
    return new Promise<void>((resolve, reject) => {
      if (lock) {
        lock
          .acquire()
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }

  public release(resource: string): void {
    const lock = this.locks.get(resource);

    if (lock) {
      lock.release();
    }
  }
}
export default AsyncLock;
