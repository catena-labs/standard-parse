# standard-parse monorepo

A small family of TypeScript libraries built on the
[Standard Schema](https://standardschema.dev) spec — work with Zod, Valibot,
Arktype, and any other compliant validation library through one consistent API.

## Packages

| Package                                             | Version                                                                                                       | Description                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`standard-parse`](./packages/standard-parse)       | [![npm](https://img.shields.io/npm/v/standard-parse.svg)](https://www.npmjs.com/package/standard-parse)       | Unified `parse` / `safeParse` / `is` API for any Standard Schema. |
| [`standard-matchers`](./packages/standard-matchers) | [![npm](https://img.shields.io/npm/v/standard-matchers.svg)](https://www.npmjs.com/package/standard-matchers) | Test matchers (Vitest `toMatchSchema`) for any Standard Schema.   |

### standard-parse

Accept user-provided schemas without coupling to a specific validation library:

```ts
import * as s from "standard-parse"

const result = s.safeParse(schema, input)
```

See the [`standard-parse` README](./packages/standard-parse/README.md).

### standard-matchers

Assert that a value matches a schema in your tests:

```ts
import "standard-matchers/vitest"

expect({ name: "Alice" }).toMatchSchema(schema)
```

See the [`standard-matchers` README](./packages/standard-matchers/README.md).

## Development

This is a [pnpm](https://pnpm.io) workspace. Run scripts from the repo root;
they fan out across both packages.

| Task       | Command          |
| ---------- | ---------------- |
| Install    | `pnpm install`   |
| Build      | `pnpm build`     |
| Test       | `pnpm test`      |
| Typecheck  | `pnpm typecheck` |
| Lint       | `pnpm lint`      |
| Full check | `pnpm check`     |

Releases are managed with
[changesets](https://github.com/changesets/changesets).

## License

[MIT](./LICENSE) © [Catena Labs, Inc](https://catenalabs.com)
