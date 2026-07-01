import { type } from "arktype"
import { describe, expect, expectTypeOf, it } from "vitest"

import { is, parse, safeParse } from "./standard-schema"
import type { StandardSchemaV1 } from "./types"
import { ValidationError } from "./validation-error"

describe("standard schema sync API types", () => {
  const schema = type({
    name: "string",
    age: "number"
  })

  it("infers parse output from the schema", () => {
    const value = parse(schema, { name: "Ada", age: 36 })

    expectTypeOf(value).toEqualTypeOf<{ name: string; age: number }>()
    expect(value.name).toBe("Ada")
  })

  it("narrows safeParse results to parsed values", () => {
    const result = safeParse(schema, { name: "Ada", age: 36 })

    if (result.issues) {
      throw new Error("Expected validation to succeed")
    }

    expectTypeOf(result.value).toEqualTypeOf<{ name: string; age: number }>()
    expect(result.value.age).toBe(36)
  })

  it("narrows unknown input with is", () => {
    const input: unknown = { name: "Ada", age: 36 }

    if (!is(schema, input)) {
      throw new Error("Expected schema to match")
    }

    expectTypeOf(input).toEqualTypeOf<{ name: string; age: number }>()
    expect(input.name).toBe("Ada")
  })

  it("exposes readonly standard schema issues on ValidationError", () => {
    const issues: readonly StandardSchemaV1.Issue[] = [
      { message: "Expected string" }
    ]
    const error = new ValidationError(issues)

    expectTypeOf(error.issues).toEqualTypeOf<
      readonly StandardSchemaV1.Issue[]
    >()
    expect(error.issues).toBe(issues)
  })
})
