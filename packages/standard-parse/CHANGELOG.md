# standard-parse

## 0.5.0

### Minor Changes

- f105add: Test against both released zod v3 and zod v4 packages.

  The test suite previously relied on zod 3.25's preview `zod/v4` subpath. We
  now install zod v4 as the primary `zod` dependency and alias zod v3 as
  `zod-v3` (`npm:zod@^3.25.76`), so the suite exercises both real released
  packages. The peer dependency for `zod` is broadened to `>= 3.25.0` to match.

  Also clarifies the Vitest test-matcher setup in the README: the import must
  live in a `.ts` file that TypeScript compiles, not as a string in
  `setupFiles`, otherwise the `toMatchSchema` type augmentation will not apply.

## 0.4.0

### Minor Changes

- 6293f83: Update the package to be ESM only, allow vitest 4.x, and use the
  direct types from @standard-schema/spec instead of aliasing

## 0.3.0

### Minor Changes

- d1599d0: Add vitest test matcher `toMatchSchema()`
- b2d3c27: Add `is()` method to assist with type guarding
- 713d7b0: [CHORE] Improve imports, linting, packaging
