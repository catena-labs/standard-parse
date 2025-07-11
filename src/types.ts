import type { StandardSchemaV1 } from "@standard-schema/spec"

export type Schema<TInput = unknown, TOutput = TInput> = StandardSchemaV1<
  TInput,
  TOutput
>
export type Input<TSchema extends Schema> = StandardSchemaV1.InferInput<TSchema>
export type Output<TSchema extends Schema> =
  StandardSchemaV1.InferOutput<TSchema>
export type Result<TOutput> = StandardSchemaV1.Result<TOutput>
export type Issue = StandardSchemaV1.Issue
