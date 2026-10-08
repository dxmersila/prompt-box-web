import { apiClient } from './client'

export interface ItemContentResponse {
  content: string
  item_id: number
}

export async function getItemContent(
  slug: string,
  token: string,
): Promise<ItemContentResponse> {
  return apiClient<ItemContentResponse>(
    `/items/${encodeURIComponent(slug)}/content`,
    {
      token,
    },
  )
}
