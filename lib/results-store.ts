// Simple localStorage-backed results list (also stores terminated / flagged sessions)

export type StoredResultStatus = "PASSED" | "FAILED" | "TERMINATED"

export interface StoredTestResult {
  id: string
  version: string
  duration: number // Producer decides unit; UI formats
  status: StoredResultStatus
  totalTests: number
  passedTests: number
  failedTests: number
  timestamp: string
  details: {
    language: string
    difficulty?: string
    category?: string
  }
  // Anti-cheat metadata
  isFlagged?: boolean
  cheatReason?: string
}

const KEY = "codevail-results"

export function getResults(): StoredTestResult[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addResult(result: StoredTestResult) {
  if (typeof window === "undefined") return
  const current = getResults()
  const next = [...current, result]
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function clearResults() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}
