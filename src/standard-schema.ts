import { ValidationError } from "./validation-error"
import type { StandardSchemaV1 } from "./types"

/**
 * Parse the input into the schema
 * @param schema - The schema to parse against
 * @param input - The input to parse
 * @returns The parsed output
 */
export function safeParse<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  input: unknown
): StandardSchemaV1.Result<StandardSchemaV1.InferOutput<TSchema>> {
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
export function parse<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  input: unknown
): StandardSchemaV1.InferOutput<TSchema> {
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
export function is<TSchema extends StandardSchemaV1>(
  schema: TSchema,
  input: unknown
): input is StandardSchemaV1.InferOutput<TSchema> {
  const result = safeParse(schema, input)
  return result.issues === undefined
}
