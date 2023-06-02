# Introduction
Memoization utility for async js functions

### [index.ts](src/index.ts)
The file contains an example of where memoization might be useful. 
It shows how memoization might be useful when calculating file hashes multiple times for the same file.
You can try it out as follows.
```bash
❯ npm run build-code 

> memoize-async-test@1.0.0 build-code /home/rahul/workspace/memoize_async_test
> run-p tsc eslint


> memoize-async-test@1.0.0 eslint /home/rahul/workspace/memoize_async_test
> eslint --format unix './src/**/*.ts'


> memoize-async-test@1.0.0 tsc /home/rahul/workspace/memoize_async_test
> tsc

❯ node build/index.js 
Calculating file hash for src/memoize.ts
Calculating file hash for src/memoize.ts
Calculating file hash for src/util.ts
Calculating file hash for src/util.ts
Calculating file hash for src/index.ts
done
```
### [memoize.spec.ts](src/memoize.spec.ts)
This file has the required test that must pass to complete the test.

### [memoize.ts](src/memoize.ts)
This file has a dummy memoize function which just calls the original function. It does not pass all tests and must be correctly implemented to pass the test.

# Steps to follow:
1. Make sure node and npm is installed. Please follow the this [guide](https://nodejs.org/en/download/package-manager/)
2. Install all the required dependencies:
   ```bash
   ❯ cd memoize_async_test
   ❯ npm install
   ```
3. Implement the [memoize_async](src/memoize.ts#L37) function correctly.
4. Run the tests and make sure they all pass:
   ```bash
    ❯ npm start
    
    > memoize-async-test@1.0.0 start /home/rahul/workspace/memoize_async_test
    > run-s clean build-code test
    
    
    > memoize-async-test@1.0.0 clean /home/rahul/workspace/memoize_async_test
    > rm -rf build/
    
    
    > memoize-async-test@1.0.0 build-code /home/rahul/workspace/memoize_async_test
    > run-p tsc eslint
    
    
    > memoize-async-test@1.0.0 eslint /home/rahul/workspace/memoize_async_test
    > eslint --format unix './src/**/*.ts'
    
    
    > memoize-async-test@1.0.0 tsc /home/rahul/workspace/memoize_async_test
    > tsc
    
    
    > memoize-async-test@1.0.0 test /home/rahul/workspace/memoize_async_test
    > jest
    
    PASS  src/memoize.spec.ts
    memoize async correctly caches
    ✓ correctly caches calls in sequence (97 ms)
    ✓ correctly caches calls in parallel (100 ms)
    ✓ correctly caches calls with number args (822 ms)
    ✓ correctly limits cache size on set (1 ms)
    ✓ correctly caches calls with string args
    ✓ correctly caches calls with boolean args (99 ms)
    ✓ correctly caches calls with number args and json return (101 ms)
    ✓ correctly expires cache 1 (200 ms)
    ✓ correctly expires cache 2 (999 ms)
    ✓ correctly limits cache size
    ✓ removes the oldest cache first
    ✓ rejects all parallel error requests
    ✓ can clear cache
    ✓ correctly caches calls with multiple args (7 ms)
    ✓ raises exceptions for invalid number of args
    ✓ raises exceptions for spread operator
    
    Test Suites: 1 passed, 1 total
    Tests:       16 passed, 16 total
    Snapshots:   0 total
    Time:        4.091 s, estimated 5 s
    Ran all test suites.
   ```

