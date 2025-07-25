import { ValidationError } from "./validation-error"
import type { Output, Result, Schema } from "./types"

/**
 * Parse the input into the schema
 * @param schema - The schema to parse against
 * @param input - The input to parse
 * @returns The parsed output
 */
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

/**
 * Parse the input into the schema
 * @param schema - The schema to parse against
 * @param input - The input to parse
 * @returns The parsed output
 */
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

/**
 * Check if the input is a valid output of the schema
 * @param schema - The schema to check against
 * @param input - The input to check
 * @returns True if the input is a valid output of the schema, false otherwise
 */
export function is<TSchema extends Schema>(
  schema: TSchema,
  input: unknown
): input is Output<TSchema> {
  const result = safeParse(schema, input)
  return result.issues === undefined
}
