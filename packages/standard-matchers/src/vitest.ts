import { safeParse } from "standard-parse"
import type { StandardSchemaV1 } from "standard-parse"
import { expect } from "vitest"

interface ExpectationResult {
  pass: boolean
  message: () => string
  actual?: unknown
  expected?: unknown
}

/*
 * A custom matcher returns what the assertion it is called on returns: `void`
 * on `expect(value)`, `Promise<void>` on `expect(value).resolves`, and
 * `unknown` when used as an asymmetric matcher through `expect.toMatchSchema`.
 * `toBeTypeOf` is a built-in matcher on every assertion object since Vitest
 * 3.2, so its return type is that type.
 */
type MatcherReturn<TAssertion> = TAssertion extends {
  toBeTypeOf: (...args: never) => infer R
}
  ? R
  : unknown

interface StandardSchemaTestMatchers {
  toMatchSchema<TOutput>(
    schema: StandardSchemaV1<unknown, TOutput>,
    additionalChecks?: (parsed: TOutput) => void
  ): MatcherReturn<this>
}

/*
 * Vitest 3.2 and 4 declare `Matchers<T>`. Vitest 5 declares `Matchers<R, T>`.
 * A module augmentation must repeat the type parameters of the interface it
 * merges with, so no single declaration can name them for both versions. A
 * declaration with no type parameters merges with either.
 */
declare module "vitest" {
  interface Matchers extends StandardSchemaTestMatchers {}
}

function toMatchSchema<TOutput>(
  this: { isNot?: boolean },
  received: unknown,
  schema: StandardSchemaV1<unknown, TOutput>,
  additionalChecks?: (parsed: TOutput) => void
): ExpectationResult {
  const result = safeParse(schema, received)

  if (result.issues) {
    return {
      pass: false,
      message: () =>
        `Expected ${JSON.stringify(received)} to match schema.\n${formatIssues(result.issues)}`,
      actual: result.issues,
      expected: undefined
    }
  }

  // Skip value assertions on the negated path (`.not`), where a match is
  // already a failure and the checks would never be meaningfully evaluated.
  if (additionalChecks && !this.isNot) {
    additionalChecks(result.value)
  }

  return {
    pass: true,
    message: () => `Expected ${JSON.stringify(received)} not to match schema`
  }
}

function formatIssues(issues: readonly StandardSchemaV1.Issue[]): string {
  return issues
    .map((issue) => {
      const pathKeys = issue.path?.map((p) =>
        typeof p === "object" ? p.key : p
      )
      const path = pathKeys ? `${pathKeys.join(".")}:` : ""
      return `  - ${path} ${issue.message}`
    })
    .join("\n")
}

expect.extend({
  toMatchSchema
})
