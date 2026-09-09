# standard-matchers

## 0.2.0

### Minor Changes

- de7a08a: Support Vitest 5. The `toMatchSchema` type augmentation now merges
  with the `Matchers` interface of Vitest 3.2, 4, and 5. As an asymmetric
  matcher, `expect.toMatchSchema(schema)` is now typed `unknown` instead of
  `any`.

### Patch Changes

- Updated dependencies [de7a08a]
  - standard-parse@0.6.1

## 0.1.0

### Minor Changes

- b2661e7: Initial release. Test matchers for any
  [Standard Schema](https://standardschema.dev) (Zod, Valibot, Arktype, and
  more), extracted from `standard-parse`. Ships the Vitest `toMatchSchema`
  matcher at `standard-matchers/vitest`.

### Patch Changes

- Updated dependencies [b2661e7]
  - standard-parse@0.6.0
