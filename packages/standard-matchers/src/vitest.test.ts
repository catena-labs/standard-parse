import { type } from "arktype"
import * as v from "valibot"
import { describe, expect, expectTypeOf, it } from "vitest"
import { z as zodV4 } from "zod"
import { z as zodV3 } from "zod-v3"

const schemaLibraries = {
  arktype: type({ name: "string>=3" }),
  valibot: v.object({ name: v.pipe(v.string(), v.minLength(3)) }),
  "zod/v4": zodV4.object({ name: zodV4.string().min(3) }),
  "zod/v3": zodV3.object({ name: zodV3.string().min(3) })
}

describe.each(Object.entries(schemaLibraries))(
  "toMatchSchema (%s)",
  (_name, schema) => {
    it("passes when the input matches the schema", () => {
      expect({ name: "John" }).toMatchSchema(schema)
    })

    it("fails when the input does not match the schema", () => {
      expect({ name: "J" }).not.toMatchSchema(schema)
    })

    it("runs additionalChecks against the parsed value", () => {
      expect({ name: "John" }).toMatchSchema(schema, (parsed) => {
        expect(parsed.name).toBe("John")
      })
    })

    it("does not run additionalChecks on the negated path", () => {
      expect(() =>
        expect({ name: "John" }).not.toMatchSchema(schema, () => {
          throw new Error("additionalChecks should not run with .not")
        })
      ).toThrow(/not to match schema/)
    })

    it("works on a resolved promise", async () => {
      await expect(Promise.resolve({ name: "John" })).resolves.toMatchSchema(
        schema
      )
    })

    it("works as an asymmetric matcher", () => {
      expect({ user: { name: "John" } }).toEqual({
        user: expect.toMatchSchema(schema)
      })
    })

    it("infers the parsed type from the schema", () => {
      expect({ name: "John" }).toMatchSchema(schema, (parsed) => {
        expectTypeOf(parsed.name).toEqualTypeOf<string>()
      })
    })

    it("returns void on a synchronous assertion", () => {
      expectTypeOf(
        expect({ name: "John" }).toMatchSchema(schema)
      ).toEqualTypeOf<void>()
    })

    it("returns a promise on a resolves assertion", async () => {
      // oxlint-disable-next-line vitest/valid-expect -- awaited after the type assertion
      const assertion = expect(
        Promise.resolve({ name: "John" })
      ).resolves.toMatchSchema(schema)
      expectTypeOf(assertion).toEqualTypeOf<Promise<void>>()
      await assertion
    })
  }
)
