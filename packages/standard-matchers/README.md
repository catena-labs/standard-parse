# standard-matchers

Test matchers for any schema that conforms to the
[Standard Schema](https://standardschema.dev) specification — works with Zod,
Valibot, Arktype, and more.

Built on [`standard-parse`](https://www.npmjs.com/package/standard-parse).

## Installation

```bash
npm install -D standard-matchers
```

## Vitest

Create a setup file that imports the matchers:

```ts
// vitest.setup.ts
import "standard-matchers/vitest"
```

Register it in your Vitest config:

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"]
  }
})
```

> **Note:** the import must live in a `.ts` file that TypeScript compiles
> (covered by your `tsconfig.json`'s `include`). Passing the package path as a
> string directly to `setupFiles` (e.g.
> `setupFiles: ["standard-matchers/vitest"]`) registers the matcher at runtime
> but does not propagate the `toMatchSchema` type augmentation to your tests.
> Alternatively, you can add the import to a single `*.ts` or `*.d.ts` file
> anywhere in your project to make the types globally available.

> **TypeScript 6+:** ambient type augmentations from packages are no longer
> picked up automatically. Add the matcher types to your `tsconfig.json`:
>
> ```json
> {
>   "compilerOptions": {
>     "types": ["standard-matchers/vitest"]
>   }
> }
> ```

Then use the `toMatchSchema` matcher in your tests:

```ts
import { expect, test } from "vitest"
import * as z from "zod"

const schema = z.object({ name: z.string() })

test("valid input matches schema", () => {
  expect({ name: "Alice" }).toMatchSchema(schema)
})

test("invalid input does not match schema", () => {
  expect({ name: 123 }).not.toMatchSchema(schema)
})

test("with additional checks", () => {
  expect({ name: "Alice" }).toMatchSchema(schema, (parsed) => {
    expect(parsed.name).toBe("Alice")
  })
})
```

> **Note:** `additionalChecks` only runs on the positive path. It is ignored
> when the matcher is negated
> (`expect(value).not.toMatchSchema(schema, checks)`), since a successful match
> there is already a test failure.

## License (MIT)

Copyright (c) 2025 [Catena Labs, Inc](https://catenalabs.com). See
[`LICENSE`](./LICENSE).
