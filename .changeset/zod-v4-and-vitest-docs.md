---
"standard-parse": minor
---

Test against both released zod v3 and zod v4 packages.

The test suite previously relied on zod 3.25's preview `zod/v4` subpath. We now
install zod v4 as the primary `zod` dependency and alias zod v3 as `zod-v3`
(`npm:zod@^3.25.76`), so the suite exercises both real released packages. The
peer dependency for `zod` is broadened to `>= 3.25.0` to match.

Also clarifies the Vitest test-matcher setup in the README: the import must live
in a `.ts` file that TypeScript compiles, not as a string in `setupFiles`,
otherwise the `toMatchSchema` type augmentation will not apply.
