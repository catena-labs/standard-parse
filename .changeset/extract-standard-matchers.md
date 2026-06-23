---
"standard-parse": minor
---

Move the `toMatchSchema` test matcher out of `standard-parse` and into a
dedicated [`standard-matchers`](https://www.npmjs.com/package/standard-matchers)
package.

The `standard-parse/test-matchers/vitest` subpath export has been removed, and
`vitest` is no longer a peer dependency of `standard-parse`. To keep using the
matcher, install `standard-matchers` and update your setup import:

```diff
- import "standard-parse/test-matchers/vitest"
+ import "standard-matchers/vitest"
```
