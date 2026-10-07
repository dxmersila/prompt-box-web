import { apiClient } from './client'

export async function recordVisit(
  visitorId: string,
  sessionId: string,
): Promise<void> {
  return apiClient<void>(
    '/analytics/events',
    {
      method: 'POST',
      body: JSON.stringify({
        event: 'visit',
        visitor_id: visitorId,
        session_id: sessionId,
      }),
    },
  )
}
