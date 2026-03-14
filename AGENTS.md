# AGENTS.md

## Project Overview

`standard-parse` is a lightweight TypeScript library that provides a unified
`parse`, `safeParse`, and `is` API for any schema conforming to the
[Standard Schema](https://standardschema.dev) spec (Zod v3/v4, Valibot, Arktype,
etc.). It is published as an npm package for library authors who need to accept
user-provided schemas without coupling to a specific validation library.

## Commands

| Task            | Command                                               |
| --------------- | ----------------------------------------------------- |
| Install         | `pnpm install`                                        |
| Build           | `pnpm build` (uses tsdown)                            |
| Test            | `pnpm test` (vitest, watch disabled by default)       |
| Run single test | `pnpm vitest run src/standard-schema.test.ts`         |
| Typecheck       | `pnpm typecheck`                                      |
| Lint            | `pnpm lint` (oxlint with type-aware checking)         |
| Lint fix        | `pnpm fix` (format + lint fix)                        |
| Format          | `pnpm format` (oxfmt)                                 |
| Full check      | `pnpm check` (format:check + lint + typecheck + test) |
| Publish check   | `pnpm publint`                                        |

## Architecture

The entire library is small and lives in `src/`:

- **`standard-schema.ts`** - Core functions: `safeParse()`, `parse()`, `is()`.
  All call `schema["~standard"].validate(input)` per the Standard Schema spec.
  Async schemas are explicitly rejected with a TypeError.
- **`validation-error.ts`** - `ValidationError` class thrown by `parse()` on
  failure. Carries the `issues` array from the Standard Schema result.
- **`types.ts`** - Re-exports `StandardSchemaV1` from `@standard-schema/spec`.
- **`index.ts`** - Barrel export.
- **`test-matchers/vitest.ts`** - Custom vitest matcher `toMatchSchema()` that
  extends `expect`. Exported as a separate entry point
  (`standard-parse/test-matchers/vitest`).

Two build entry points in tsdown: `src/index.ts` and
`src/test-matchers/vitest.ts`. Outputs ESM with `.d.ts` declarations.

## Testing

Tests in `src/standard-schema.test.ts` use `describe.each` to run the same suite
against all four schema libraries (Arktype, Valibot, Zod v3, Zod v4). The vitest
setup file (`vitest.config.ts`) auto-registers the custom `toMatchSchema`
matcher.

## Tooling

- **Package manager**: pnpm (v10, enforced via `mise.toml`)
- **Bundler**: tsdown (ESM output + DTS)
- **Linter**: oxlint (not ESLint) with type-aware checking. `no-explicit-any` is
  error-level except in test files.
- **Formatter**: oxfmt (not Prettier)
- **Versioning**: changesets (`@changesets/cli`)
