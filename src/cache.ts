import { ReadonlyDeep } from 'type-fest';

class Cache<R> {
  private readonly cache: Map<string, ReadonlyDeep<R>>;
  private readonly capacity: number;
  private readonly ttl: number;

  public constructor(size: number, ttl: number) {
    this.cache = new Map<string, ReadonlyDeep<R>>();
    this.capacity = size;
    this.ttl = ttl;
  }

  public get(key: string): ReadonlyDeep<R> {
    return this.cache.get(key) as ReadonlyDeep<R>;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public set(key: string, value: ReadonlyDeep<R>): void {
    // First check whether this size of cache reached to its capacity or not
    // Evict the first inserted element from the cache
    if (this.cache.size === this.capacity) {
      const firstEntry = this.cache.entries().next().value;
      if (firstEntry) {
        const [k] = firstEntry;
        this.cache.delete(k);
      }
    }

    // Now set value in the cache and start TTL timer
    this.setWithTTL(key, value);
  }

  public size(): number {
    return this.cache.size;
  }

  public clear(): void {
    this.cache.clear();
  }

  private setWithTTL(key: string, value: ReadonlyDeep<R>): void {
    this.cache.set(key, value);
    setTimeout(() => {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      }
    }, this.ttl * 1000);
  }
}
export default Cache;
