# AGENTS.md

## Project Overview

This is a pnpm-workspace monorepo with two published packages under `packages/`:

- **`standard-parse`** - a lightweight TypeScript library providing a unified
  `parse`, `safeParse`, and `is` API for any schema conforming to the
  [Standard Schema](https://standardschema.dev) spec (Zod v3/v4, Valibot,
  Arktype, etc.). For library authors who need to accept user-provided schemas
  without coupling to a specific validation library.
- **`standard-matchers`** - test matchers (currently the Vitest `toMatchSchema`)
  for any Standard Schema. Depends on `standard-parse` via `workspace:^`.

## Commands

Run from the repo root. Root scripts fan out across packages with `pnpm -r`;
build runs in topological order (`standard-parse` before `standard-matchers`).

| Task       | Command                                               |
| ---------- | ----------------------------------------------------- |
| Install    | `pnpm install`                                        |
| Build      | `pnpm build` (tsdown, all packages)                   |
| Test       | `pnpm test` (vitest, all packages)                    |
| Typecheck  | `pnpm typecheck` (tsc --noEmit, all packages)         |
| Lint       | `pnpm lint` (oxlint with type-aware checking)         |
| Lint fix   | `pnpm fix` (format + lint fix)                        |
| Format     | `pnpm format` (oxfmt)                                 |
| Full check | `pnpm check` (format:check + lint + typecheck + test) |

`standard-matchers` consumes `standard-parse` through its built `dist`, and
oxlint's type-aware pass needs those types too, so the root `lint`, `typecheck`,
`test`, and `check` scripts build first (`pnpm -r run build`) — they are
self-contained and need no manual build, even after `pnpm clean`. To target one
package, use `pnpm --filter standard-parse <script>` (build `standard-parse`
first if it consumes `dist`).

## Architecture

### `packages/standard-parse/src/`

- **`standard-schema.ts`** - Core functions: `safeParse()`, `parse()`, `is()`.
  All call `schema["~standard"].validate(input)` per the Standard Schema spec.
  Async schemas are explicitly rejected with a TypeError.
- **`validation-error.ts`** - `ValidationError` class thrown by `parse()` on
  failure. Carries the `issues` array from the Standard Schema result.
- **`types.ts`** - Re-exports `StandardSchemaV1` from `@standard-schema/spec`.
- **`index.ts`** - Barrel export.

Single tsdown entry point (`src/index.ts`), ESM with `.d.ts` declarations.

### `packages/standard-matchers/src/`

- **`vitest.ts`** - Custom Vitest matcher `toMatchSchema()` that extends
  `expect`, built on `safeParse` from `standard-parse`. Published as the
  `standard-matchers/vitest` subpath export.

## Testing

`standard-parse` tests (`standard-schema.test.ts`) use `describe.each` to run
the same suite against all four schema libraries (Arktype, Valibot, Zod v3, Zod
v4). `standard-matchers` tests register `toMatchSchema` via its own vitest setup
file (`vitest.config.ts`).

## Tooling

- **Package manager**: pnpm (v10, enforced via `mise.toml`)
- **Bundler**: tsdown (ESM output + DTS)
- **Linter**: oxlint (not ESLint) with type-aware checking. `no-explicit-any` is
  error-level except in test files.
- **Formatter**: oxfmt (not Prettier)
- **Versioning**: changesets (`@changesets/cli`)
