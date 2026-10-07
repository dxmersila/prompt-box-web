const VISITOR_ID_KEY = 'armin_analytics_visitor_id'
const SESSION_ID_KEY = 'armin_analytics_session_id'
const SESSION_ACTIVITY_KEY = 'armin_analytics_session_last_activity'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000

function createId(): string {
  return crypto.randomUUID()
}

export function getVisitorId(): string {
  const existing = window.localStorage.getItem(VISITOR_ID_KEY)

  if (existing) {
    return existing
  }

  const visitorId = createId()
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId)

  return visitorId
}

export function getSessionId(): string {
  const now = Date.now()
  const existingSessionId = window.sessionStorage.getItem(SESSION_ID_KEY)
  const lastActivity = Number(
    window.sessionStorage.getItem(SESSION_ACTIVITY_KEY),
  )

  if (
    existingSessionId &&
    Number.isFinite(lastActivity) &&
    now - lastActivity < SESSION_TIMEOUT_MS
  ) {
    window.sessionStorage.setItem(
      SESSION_ACTIVITY_KEY,
      String(now),
    )

    return existingSessionId
  }

  const sessionId = createId()

  window.sessionStorage.setItem(SESSION_ID_KEY, sessionId)
  window.sessionStorage.setItem(
    SESSION_ACTIVITY_KEY,
    String(now),
  )

  return sessionId
}
