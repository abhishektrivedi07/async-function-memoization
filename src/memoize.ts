import { ReadonlyDeep } from 'type-fest';
import AsyncLock from './lock';
import Cache from './cache';
// We don't allow null. undefined is required instead.
export type SimpleArgs = (string | number | boolean | undefined)[];

export type BasicAsyncFunc<U extends SimpleArgs, R> = (...args: U) => Promise<ReadonlyDeep<R>>;

interface Memoized<U extends SimpleArgs, R> extends BasicAsyncFunc<U, R> {
  cache_size: () => number;
  clear_cache: () => void;
}

const generateCacheKey = <U extends SimpleArgs>(...args: U): string => {
  return args.map(arg => `${typeof arg}:${JSON.stringify(arg)}`).join(',');
};

/**
 * Memoizes async functions.
 * The function signature that can be memoized are deliberately restricted
 * to primitive datatypes, to make sure they can be correctly cached.
 *
 * This `rightly` puts the burden on the user to correctly build a function to be memoized
 * rather than a library which has little knowledge of the function.
 *
 * Multiple parallel calls with the same key require only a single call to the wrapped async function.
 *
 * Example:
 * const get_user = memoize_async({ ttl: 60, size: 100 }, async (user_id: number) => {
 *  user = await database.get_user(user_id);
 *  return user;
 * });
 * const u1 = await get_user(2); // Calls database.get_user
 * const u2 = await get_user(2); // Returns from cache
 *
 * @param options Options:
 *  ttl: Seconds till the cache expires
 *  size: The maximum number of items allowed in the cache.
 *        Oldest items are removed first when limit is reached.
 * @param f The async function to be memoized
 */
const memoize_async = <R, U extends SimpleArgs>(
  options: { ttl: number; size: number },
  f: BasicAsyncFunc<U, R>,
): Memoized<U, R> => {
  const cache = new Cache(options.size, options.ttl);
  const Lock = new AsyncLock();
  const memo: BasicAsyncFunc<U, R> = async function (...args: U) {
    if (args.length !== f.length || (args.length !== 0 && f.length === 0)) {
      throw new Error(`Invalid number of arguments passed (${args.length} != ${f.length}) or used spread operator`);
    }

    const key: string = generateCacheKey(...args);
    let value: ReadonlyDeep<R> = cache.get(key) as ReadonlyDeep<R>;
    if (value === undefined) {
      await Lock.acquire(key);
      try {
        // Gets the value from the cache if it's already there,
        // set by other concurrent request, or fetches the new
        // data and stores it in cache.
        value = cache.get(key) as ReadonlyDeep<R>;
        if (value === undefined) {
          value = await f(...args);
          cache.set(key, value);
        }
      } finally {
        Lock.release(key);
      }
    }
    return value;
  };
  return Object.assign(memo, {
    cache_size: () => {
      return cache.size();
    },
    clear_cache: () => {
      cache.clear();
    },
  });
};

export default memoize_async;
