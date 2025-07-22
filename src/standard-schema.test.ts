import { type } from "arktype"
import * as v from "valibot"
import { describe, expect, it } from "vitest"
import { z as zodV3 } from "zod/v3"
import * as zodV4 from "zod/v4"
import * as s from "./standard-schema"
import { ValidationError } from "./validation-error"

const schemaLibraries = {
  arktype: {
    schema: type({
      name: "string>=3"
    }),
    errorMessage: "name must be at least length 3 (was 1)"
  },
  valibot: {
    schema: v.object({
      name: v.pipe(v.string(), v.minLength(3))
    }),
    errorMessage: "Invalid length: Expected >=3 but received 1"
  },
  "zod/v4": {
    schema: zodV4.object({
      name: zodV4.string().min(3)
    }),
    errorMessage: "Too small: expected string to have >=3 characters"
  },
  "zod/v3": {
    schema: zodV3.object({
      name: zodV3.string().min(3)
    }),
    errorMessage: "String must contain at least 3 character(s)"
  }
}

describe.each(Object.entries(schemaLibraries))(
  "%s",
  (_name, { schema, errorMessage }) => {
    describe("safeParse()", () => {
      it("returns the parsed value", () => {
        const result = s.safeParse(schema, { name: "John" })
        if (result.issues) {
          throw new Error("Validation failed")
        }
        expect(result.value).toEqual({ name: "John" })
      })

      it("returns the issues if the input is invalid", () => {
        const result = s.safeParse(schema, { name: "J" })
        expect(result.issues).toBeDefined()
        if (!result.issues) {
          throw new Error("Validation failed")
        }
        expect(result.issues[0]?.message).toBe(errorMessage)
      })
    })

    describe("parse()", () => {
      it("returns the parsed value", () => {
        const result = s.parse(schema, { name: "John" })
        expect(result).toEqual({ name: "John" })
      })

      it("throws a ValidationError if the input is invalid", () => {
        expect(() => s.parse(schema, { name: "J" })).toThrow(ValidationError)
      })
    })

    describe("is()", () => {
      it("returns true if the input is valid", () => {
        expect(s.is(schema, { name: "John" })).toBe(true)
      })

      it("returns false if the input is invalid", () => {
        expect(s.is(schema, { name: "J" })).toBe(false)
      })
    })

    describe("schema matchers", () => {
      it("returns true if the input is valid", () => {
        expect({ name: "John" }).toMatchSchema(schema)
      })

      it("returns false if the input is invalid", () => {
        expect({ name: "J" }).not.toMatchSchema(schema)
      })
    })
  }
)

describe("async schemas", () => {
  it("throws if the result is a promise", () => {
    const schema = v.objectAsync({
      name: v.pipeAsync(
        v.string(),
        v.checkAsync(() => Promise.resolve(true))
      )
    })

    expect(() => s.safeParse(schema, { name: "John" })).toThrow(
      "Invalid type: Input is a Promise"
    )
    expect(() => s.parse(schema, { name: "John" })).toThrow(
      "Invalid type: Input is a Promise"
    )
  })
})
