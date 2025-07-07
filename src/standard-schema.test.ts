import * as v from "valibot"
import { type } from "arktype"
import { z as zodV3 } from "zod/v3"
import * as zodV4 from "zod/v4"
import { describe, expect, it } from "bun:test"
import { parse, safeParse } from "./standard-schema"
import { ValidationError } from "./validation-error"
import type { Schema } from "./types"

describe("arktype", () => {
  const schema = type({
    name: "string>=3"
  })

  testSafeParse(schema, "name must be at least length 3 (was 1)")
  testParse(schema)
})

describe("valibot", () => {
  const schema = v.object({
    name: v.pipe(v.string(), v.minLength(3))
  })

  testSafeParse(schema, "Invalid length: Expected >=3 but received 1")
  testParse(schema)
})

describe("zod/v3", () => {
  const schema = zodV3.object({
    name: zodV3.string().min(3)
  })

  testSafeParse(schema, "String must contain at least 3 character(s)")
  testParse(schema)
})

describe("zod/v4", () => {
  const schema = zodV4.object({
    name: zodV4.string().min(3)
  })

  testSafeParse(schema, "Too small: expected string to have >=3 characters")
  testParse(schema)
})

function testSafeParse(schema: Schema, errorMessage: string) {
  return describe("safeParse()", () => {
    it("returns the parsed value", () => {
      const result = safeParse(schema, { name: "John" })
      if (result.issues) {
        throw new Error("Validation failed")
      }
      expect(result.value).toEqual({ name: "John" })
    })

    it("returns the issues if the input is invalid", () => {
      const result = safeParse(schema, { name: "J" })
      expect(result.issues).toBeDefined()
      if (!result.issues) {
        throw new Error("Validation failed")
      }
      expect(result.issues[0]?.message).toBe(errorMessage)
    })
  })
}

function testParse(schema: Schema) {
  return describe("parse()", () => {
    it("returns the parsed value", () => {
      const result = parse(schema, { name: "John" })
      expect(result).toEqual({ name: "John" })
    })

    it("throws a ValidationError if the input is invalid", () => {
      expect(() => parse(schema, { name: "J" })).toThrow(ValidationError)
    })
  })
}
