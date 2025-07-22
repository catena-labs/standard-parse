import type { Output, Result, Schema } from "./types"
import { ValidationError } from "./validation-error"

export function safeParse<TSchema extends Schema>(
  schema: TSchema,
  input: unknown
): Result<Output<TSchema>> {
  const result = schema["~standard"].validate(input)
  if (result instanceof Promise) {
    throw new TypeError("Invalid type: Input is a Promise")
  }
  return result
}

export function parse<TSchema extends Schema>(
  schema: TSchema,
  input: unknown
): Output<TSchema> {
  const result = safeParse(schema, input)

  // if the `issues` field exists, the validation failed
  if (result.issues) {
    throw new ValidationError(result.issues)
  }

  return result.value
}
