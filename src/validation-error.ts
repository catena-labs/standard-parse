import type { Issue } from "./types"

export class ValidationError extends Error {
  public readonly issues: readonly Issue[]
  public override readonly name = "ValidationError"

  constructor(issues: readonly Issue[]) {
    const formattedMessage = issues[0]?.message
      ? `Invalid type: ${issues[0].message.replace("Invalid key:", "")}`
      : "Invalid type"
    super(formattedMessage)
    this.issues = issues
  }
}
