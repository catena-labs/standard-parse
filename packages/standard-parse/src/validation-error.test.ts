import { type } from "arktype"
import * as v from "valibot"
import { describe, expect, it } from "vitest"
import { z } from "zod"
import { z as zodV3 } from "zod-v3"

import { parse } from "./standard-schema"
import type { StandardSchemaV1 } from "./types"
import { ValidationError } from "./validation-error"

describe("ValidationError message", () => {
  it("uses the first issue message verbatim without an Invalid type prefix", () => {
    const schema = v.object({ name: v.pipe(v.string(), v.minLength(3)) })

    expect(() => parse(schema, { name: "J" })).toThrow(
      "Invalid length: Expected >=3 but received 1"
    )
  })

  it("prepends the issue path when present", () => {
    const schema = z.object({
      user: z.object({ name: z.string().min(3) })
    })

    const error: ValidationError | undefined = captureParseError(schema, {
      user: { name: "J" }
    })
    expect(error).toBeInstanceOf(ValidationError)
    expect(error?.message).toContain("user.name")
    expect(error?.message).not.toContain("Invalid type")
  })

  it("falls back to a generic message when issues are empty", () => {
    const error = new ValidationError([])
    expect(error.message).toBe("Validation failed")
  })

  it("keeps library-specific messages intact across libraries", () => {
    const schemas = [
      type({ name: "string>=3" }),
      v.object({ name: v.pipe(v.string(), v.minLength(3)) }),
      z.object({ name: z.string().min(3) }),
      zodV3.object({ name: zodV3.string().min(3) })
    ]

    for (const schema of schemas) {
      const error = captureParseError(schema, { name: "J" })
      expect(error).toBeInstanceOf(ValidationError)
      expect(error?.message).not.toMatch(/^Invalid type:/)
      expect(error?.message.length).toBeGreaterThan(0)
    }
  })
})

function captureParseError(
  schema: StandardSchemaV1,
  input: unknown
): ValidationError | undefined {
  try {
    parse(schema, input)
  } catch (e) {
    return e instanceof ValidationError ? e : undefined
  }
  return undefined
}
