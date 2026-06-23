import type { StandardSchemaV1 } from "./types"

export class ValidationError extends Error {
  public readonly issues: readonly StandardSchemaV1.Issue[]
  public override readonly name = "ValidationError"

  constructor(issues: readonly StandardSchemaV1.Issue[]) {
    const formattedMessage = issues[0]?.message
      ? `Invalid type: ${issues[0].message.replace("Invalid key:", "")}`
      : "Invalid type"
    super(formattedMessage)
    this.issues = issues
  }
}
