import type { StandardSchemaV1 } from "@standard-schema/spec"

export type Schema<Input = unknown, Output = Input> = StandardSchemaV1<
  Input,
  Output
>
export type Output<T extends Schema> = StandardSchemaV1.InferOutput<T>
export type Input<T extends Schema> = StandardSchemaV1.InferInput<T>
export type Result<T extends Schema> = StandardSchemaV1.Result<Output<T>>
export type Issue = StandardSchemaV1.Issue
