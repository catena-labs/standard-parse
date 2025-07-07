# standard-parse

Unified API for any schema that conforms to the [Standard Schema](https://standardschema.dev) specification — works with Zod, Valibot, Arktype, and more.

**standard-parse** provides a simple, consistent interface (`parse`, `safeParse`) for validating and parsing input using any schema that implements the [Standard Schema V1](https://standardschema.dev) interface.

## Why?

Library authors often need to accept schemas from users without knowing which validation library they're using. Instead of supporting each library individually:

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

Perfect for form libraries, API frameworks, configuration parsers, or any library that needs to work with user-provided schemas.

## Features

- Works with [Zod](https://github.com/colinhacks/zod), [Valibot](https://valibot.dev/), and [Arktype](https://arktype.io/)
- Unified API: `parse`, `safeParse`
- Lightweight abstraction layer
- Compatible with any schema that implements Standard Schema V1

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

## API

### `parse(schema, input)`

Validates and returns the parsed value, or throws ValidationError on failure.

```ts
const output = s.parse(schema, input)
```

### `safeParse(schema, input)`

Returns an object with either `value` or `issues`:

```ts
const result = s.safeParse(schema, input)
if (result.issues) {
  // handle errors
} else {
  // result.value is typed
}
```

## Types

```ts
import type * as s from "standard-parse"
// s.Schema<TInput, TOutout>
// s.Input<TSchema>
// s.Output<TSchema>
// s.Result<TSchema>
// s.Issue
```

These are re-exported from `@standard-schema/spec`.

## ValidationError

`parse` will throw a `ValidationError` on failure:

```ts
import { ValidationError } from "standard-parse"

try {
  s.parse(schema, badInput)
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(err.issues)
  }
}
```

## License (MIT)

Copyright (c) 2025 [Catena Labs, Inc](https://catenalabs.com). See [`LICENSE`](./LICENSE).
