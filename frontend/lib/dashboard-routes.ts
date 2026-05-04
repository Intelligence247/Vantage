/** Persisted on login / session restore so the public navbar can link correctly before `/users/me` resolves. */
export const LAST_KNOWN_ROLE_KEY = "vantage_last_role"

export function getLastKnownRole(): string | undefined {
  if (typeof window === "undefined") return undefined
  return localStorage.getItem(LAST_KNOWN_ROLE_KEY) ?? undefined
}

export function setLastKnownRole(role: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LAST_KNOWN_ROLE_KEY, role)
}

export function clearLastKnownRole(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(LAST_KNOWN_ROLE_KEY)
}

/**
 * Maps API role strings to the correct dashboard home path.
 */
export function getDashboardPath(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin"
    case "agent":
      return "/dashboard/vendor"
    case "buyer":
    case "user":
    default:
      return "/dashboard/buyer"
  }
}

/** Human-readable role for sidebars and headers. */
export function formatRoleLabel(role: string | undefined): string {
  if (!role) return "Account"
  const map: Record<string, string> = {
    admin: "Administrator",
    agent: "Verified agent",
    buyer: "Buyer",
    user: "Buyer",
  }
  return map[role] ?? role.charAt(0).toUpperCase() + role.slice(1)
}
