# standard-parse

Unified `parse` API for any schema that conforms to the
[Standard Schema](https://standardschema.dev) specification — works with Zod,
Valibot, Arktype, and more.

**standard-parse** provides a simple, consistent interface (`parse`,
`safeParse`) for validating and parsing input using any schema that implements
the [Standard Schema V1](https://standardschema.dev) interface.

## Why?

Library authors often need to accept schemas from users without knowing which
validation library they're using. Instead of supporting each library
individually:

```ts
// Before: supporting multiple libraries is painful
if (isZodSchema(schema)) {
  return schema.parse(input)
} else if (isValibotSchema(schema)) {
  return parse(schema, input)
} else if (isArktypeSchema(schema)) {
  return schema(input)
}
```

Use standard-parse to handle any Standard Schema-compliant library:

```ts
// After: one API for all
import * as s from "standard-parse"
return s.parse(schema, input)
```

Perfect for form libraries, API frameworks, configuration parsers, or any
library that needs to work with user-provided schemas.

## Features

- Works with [Zod](https://github.com/colinhacks/zod),
  [Valibot](https://valibot.dev/), [Arktype](https://arktype.io/), and more.
- Unified API: `parse()`, `safeParse()`, `is()`
- Lightweight abstraction layer
- Compatible with any schema that implements
  [Standard Schema V1](https://standardschema.dev/).

## Installation

```bash
npm install standard-parse
```

## Usage

### Zod v4

```ts
import * as z from "zod/v4"
import * as s from "standard-parse"

const schema = z.object({ name: z.string() })

const result = s.safeParse(schema, { name: "Alice" })
if (result.issues) {
  console.error("Invalid:", result.issues)
} else {
  console.log("Valid!", result.value)
}
```

### Zod v3

```ts
import { z } from "zod/v3"
import * as s from "standard-parse"

const schema = z.object({ name: z.string() })

const result = s.safeParse(schema, { name: "Alice" })
if (result.issues) {
  console.error("Invalid:", result.issues)
} else {
  console.log("Valid!", result.value)
}
```

### Valibot

```ts
import * as v from "valibot"
import * as s from "standard-parse"

const schema = v.object({ name: v.string() })
const value = s.parse(schema, { name: "Alice" }) // throws on failure
```

### Arktype

```ts
import { type } from "arktype"
import * as s from "standard-parse"

const schema = type({ name: "string" })
const value = s.parse(schema, { name: "Alice" })
```

## Test Matchers

Looking for a `toMatchSchema` matcher for your tests? It now lives in a
dedicated package,
[`standard-matchers`](https://www.npmjs.com/package/standard-matchers):

```bash
npm install -D standard-matchers
```

```ts
// vitest.setup.ts
import "standard-matchers/vitest"
```

See the
[`standard-matchers` README](https://github.com/catena-labs/standard-parse/tree/main/packages/standard-matchers#readme)
for setup details.

## API

#### `parse(schema, input)`

```ts
parse<TSchema>(
  schema: TSchema,
  input: unknown
): StandardSchemaV1.InferOutput<TSchema>
```

Validates and returns the parsed value, or throws `ValidationError` on failure.

```ts
const output = s.parse(schema, input)
```

#### `safeParse(schema, input)`

```ts
safeParse<TSchema>(
  schema: TSchema,
  input: unknown
): StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>>
```

Returns an object with either `value` or `issues`:

```ts
const result = s.safeParse(schema, input)
if (result.issues) {
  // handle errors
} else {
  // result.value is typed
}
```

#### `is(schema, input)`

```ts
is<TSchema>(
  schema: TSchema,
  input: unknown
): input is StandardSchemaV1.InferOutput<TSchema>
```

Validates that an input matches the schema, narrowing its type.

```ts
if (s.is(schema, input)) {
  // input matches schema
}
```

## Types

```ts
import type { StandardSchemaV1 } from "standard-parse"
// StandardSchemaV1<TInput, TOutput>
// StandardSchemaV1.InferInput<TSchema>
// StandardSchemaV1.InferOutput<TSchema>
// StandardSchemaV1.Result<TOutput>
// StandardSchemaV1.Issue
```

Re-exported from `@standard-schema/spec`.

## ValidationError

`parse` will throw a `ValidationError` on failure:

```ts
import * as s from "standard-parse"

try {
  s.parse(schema, badInput)
} catch (err) {
  if (err instanceof s.ValidationError) {
    console.error(err.issues)
  }
}
```

## License (MIT)

Copyright (c) 2025 [Catena Labs, Inc](https://catenalabs.com). See
[`LICENSE`](./LICENSE).
