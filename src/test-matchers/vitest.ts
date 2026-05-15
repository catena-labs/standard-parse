import { expect } from "vitest"

import { formatIssues } from "../format-issues"
import { safeParse } from "../standard-schema"
import type { StandardSchemaV1 } from "../types"

interface ExpectationResult {
  pass: boolean
  message: () => string
  actual?: unknown
  expected?: unknown
}

interface StandardSchemaTestMatchers<R = unknown> {
  toMatchSchema<TOutput>(
    schema: StandardSchemaV1<unknown, TOutput>,
    additionalChecks?: (parsed: TOutput) => void
  ): R
}

declare module "vitest" {
  // oxlint-disable-next-line typescript/no-explicit-any -- must match vitest's built-in Matchers<T = any> signature
  interface Matchers<T = any> extends StandardSchemaTestMatchers<T> {}
}

function toMatchSchema<TOutput>(
  this: unknown,
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

  if (additionalChecks) {
    additionalChecks(result.value)
  }

  return {
    pass: true,
    message: () => `Expected ${JSON.stringify(received)} not to match schema`
  }
}

expect.extend({
  toMatchSchema
})
