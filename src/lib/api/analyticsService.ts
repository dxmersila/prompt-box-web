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

export async function recordPromptCopy(
  visitorId: string,
  sessionId: string,
  itemId: number,
  token: string,
): Promise<void> {
  return apiClient<void>(
    '/analytics/events',
    {
      method: 'POST',
      token,
      body: JSON.stringify({
        event: 'prompt_copy',
        visitor_id: visitorId,
        session_id: sessionId,
        item_id: itemId,
      }),
    },
  )
}
