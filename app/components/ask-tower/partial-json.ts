// Best-effort parse of a JSON document that is still streaming in: closes any open string, drops a
// dangling key or trailing comma, and closes open objects/arrays, so partially written answers can
// render progressively. Returns null when nothing usable can be recovered yet.
export function parsePartialJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    // fall through to repair
  }

  const stack: string[] = []
  let inString = false
  let escaped = false
  for (const ch of text) {
    if (inString) {
      if (escaped) escaped = false
      else if (ch === "\\") escaped = true
      else if (ch === '"') inString = false
      continue
    }
    if (ch === '"') inString = true
    else if (ch === "{" || ch === "[") stack.push(ch)
    else if (ch === "}" || ch === "]") stack.pop()
  }

  let repaired = text
  if (inString) repaired += '"'
  // Trim a trailing comma, a dangling "key": or a dangling "key" with no colon yet
  repaired = repaired
    .replace(/,\s*$/, "")
    .replace(/,?\s*"[^"]*"\s*:\s*$/, "")
    .replace(/([{,])\s*"[^"]*"\s*$/, "$1")
    .replace(/,\s*$/, "")
  for (let i = stack.length - 1; i >= 0; i--) repaired += stack[i] === "{" ? "}" : "]"

  try {
    return JSON.parse(repaired) as T
  } catch {
    return null
  }
}
