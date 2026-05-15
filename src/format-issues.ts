import type { StandardSchemaV1 } from "./types"

function formatPath(path: NonNullable<StandardSchemaV1.Issue["path"]>): string {
  return path
    .map((segment) => {
      const key = typeof segment === "object" ? segment.key : segment
      return String(key)
    })
    .join(".")
}

/**
 * Format Standard Schema issues into a readable multiline message.
 *
 * @param issues - The validation issues to format
 * @returns A readable issue summary
 */
export function formatIssues(
  issues: readonly StandardSchemaV1.Issue[]
): string {
  if (issues.length === 0) {
    return "Invalid input"
  }

  return issues
    .map((issue) => {
      const path = issue.path?.length ? `${formatPath(issue.path)}: ` : ""
      return `- ${path}${issue.message}`
    })
    .join("\n")
}
