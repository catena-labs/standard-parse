---
"standard-matchers": minor
---

Support Vitest 5. The `toMatchSchema` type augmentation now merges with the
`Matchers` interface of Vitest 3.2, 4, and 5. As an asymmetric matcher,
`expect.toMatchSchema(schema)` is now typed `unknown` instead of `any`.
