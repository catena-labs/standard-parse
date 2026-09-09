import type { StandardSchemaV1 } from "./types"

export class ValidationError extends Error {
  public readonly issues: readonly StandardSchemaV1.Issue[]
  public override readonly name = "ValidationError"

  constructor(issues: readonly StandardSchemaV1.Issue[]) {
    const firstIssue = issues[0]
    const path = firstIssue?.path
      ?.map((segment) =>
        typeof segment === "object" ? String(segment.key) : String(segment)
      )
      .join(".")
    const location = path ? `${path}: ` : ""
    super(
      firstIssue?.message
        ? `${location}${firstIssue.message}`
        : "Validation failed"
    )
    this.issues = issues
  }
}
