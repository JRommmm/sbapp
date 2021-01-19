Some testing error origins:

- creating typescript build (tsc) will cause errors
    - temp soln: delete test.js files in the build, before running tests
eg. (terminal) 
1. tsc
2. npm test
3. [Error]
Instead do:
1. tsc
2. [Delete test.js files in build]
3. npm test
