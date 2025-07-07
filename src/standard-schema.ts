import { ValidationError } from "./validation-error"
import type { Output, Result, Schema } from "./types"

export function safeParse<T extends Schema>(
  schema: T,
  input: unknown
): Result<T> {
  const result = schema["~standard"].validate(input)
  if (result instanceof Promise) {
    throw new TypeError("Invalid type: Input is a Promise")
  }
  return result
}

export function parse<T extends Schema>(schema: T, input: unknown): Output<T> {
  const result = safeParse(schema, input)

  // if the `issues` field exists, the validation failed
  if (result.issues) {
    throw new ValidationError(result.issues)
  }

  return result.value
}
